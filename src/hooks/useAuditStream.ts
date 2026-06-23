import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

export type ConnectionStatus = 'connecting' | 'connected' | 'reconnecting' | 'disconnected';

export interface AuditEvent {
  id: string;
  type: 'login' | 'changeRole' | 'createRole' | 'viewMatrix';
  timestamp: string;
  details: Record<string, string>;
}

const MAX_LOG_ITEMS = 100;
const BASE_BACKOFF_MS = 1000;
const MAX_BACKOFF_MS = 30_000;
const BACKOFF_MULTIPLIER = 2;

interface UseAuditStreamOptions {
  url: string;
  enabled?: boolean;
}

interface UseAuditStreamResult {
  logs: AuditEvent[];
  status: ConnectionStatus;
  reconnectCount: number;
}

/**
 * useAuditStream — subscribes to a backend SSE audit stream.
 *
 * Features:
 * - Sends Bearer token from Zustand auth store via a URL query param fallback
 *   (EventSource does not support custom headers natively in browsers)
 * - Exponential backoff with jitter on reconnect
 * - Sliding window buffer capped at MAX_LOG_ITEMS
 * - Cancels stream cleanly on unmount
 */
export function useAuditStream({ url, enabled = true }: UseAuditStreamOptions): UseAuditStreamResult {
  const token = useAuthStore((s) => s.token);
  const [logs, setLogs] = useState<AuditEvent[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [reconnectCount, setReconnectCount] = useState(0);

  const esRef = useRef<EventSource | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptRef = useRef(0);
  const isMountedRef = useRef(true);

  const clearTimer = () => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  };

  const closeES = () => {
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
  };

  const connect = useCallback(() => {
    if (!isMountedRef.current || !enabled) return;

    closeES();
    clearTimer();

    // Pass token as a query param since EventSource cannot set Authorization headers
    const streamUrl = token ? `${url}?token=${encodeURIComponent(token)}` : url;
    const es = new EventSource(streamUrl);
    esRef.current = es;

    if (reconnectAttemptRef.current === 0) {
      setStatus('connecting');
    } else {
      setStatus('reconnecting');
    }

    es.addEventListener('audit', (ev: MessageEvent) => {
      if (!isMountedRef.current) return;
      try {
        const event: AuditEvent = JSON.parse(ev.data as string);
        setLogs((prev) => [event, ...prev].slice(0, MAX_LOG_ITEMS));
        if (reconnectAttemptRef.current > 0) {
          reconnectAttemptRef.current = 0;
          setReconnectCount(0);
        }
        setStatus('connected');
      } catch {
        // Malformed JSON — ignore
      }
    });

    es.onopen = () => {
      if (!isMountedRef.current) return;
      reconnectAttemptRef.current = 0;
      setReconnectCount(0);
      setStatus('connected');
    };

    es.onerror = () => {
      if (!isMountedRef.current) return;

      closeES();
      setStatus('reconnecting');
      reconnectAttemptRef.current += 1;
      setReconnectCount(reconnectAttemptRef.current);

      // Exponential backoff with jitter
      const baseDelay = Math.min(
        BASE_BACKOFF_MS * Math.pow(BACKOFF_MULTIPLIER, reconnectAttemptRef.current - 1),
        MAX_BACKOFF_MS,
      );
      const jitter = Math.random() * 0.3 * baseDelay;
      const delay = Math.round(baseDelay + jitter);

      reconnectTimerRef.current = setTimeout(() => {
        connect();
      }, delay);
    };
  }, [url, token, enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    isMountedRef.current = true;

    if (!enabled) {
      setStatus('disconnected');
      return;
    }

    connect();

    return () => {
      isMountedRef.current = false;
      clearTimer();
      closeES();
      setStatus('disconnected');
    };
  }, [connect, enabled]);

  return { logs, status, reconnectCount };
}
