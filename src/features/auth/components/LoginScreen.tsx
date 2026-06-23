import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Laptop, Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '@/lib/api';

export function LoginScreen() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; api?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const { setAuth, authError, setAuthError } = useAuthStore();

  // Clear previous session errors when editing fields
  useEffect(() => {
    if (authError) {
      setAuthError(null);
    }
  }, [email, password]);

  const toggleLanguage = () => {
    if (isLoading) return; // Disable language change during login loading
    const nextLng = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(nextLng);
    localStorage.setItem('i18nextLng', nextLng);
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = t('rbac.createRoleModal.errorEmpty'); // fallback or reuse empty msg
    } else if (!emailRegex.test(email)) {
      newErrors.email = t('auth.errorInvalidEmail');
    }

    if (!password) {
      newErrors.password = t('rbac.createRoleModal.errorEmpty');
    } else if (password.length < 6) {
      newErrors.password = t('auth.errorShortPassword');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (validateForm()) {
      setIsLoading(true);
      setErrors({});
      try {
        const response = await api.post('/api/v1/auth/login', { email, password });
        const { token, user } = response.data;
        setAuth(token, user);
      } catch (err: any) {
        if (err.response) {
          if (err.response.status === 401) {
            setErrors({ api: t('auth.errorInvalidCredentials') });
          } else {
            setErrors({ api: err.response.data?.error || t('auth.errorUnauthorized') });
          }
        } else {
          setErrors({ api: t('auth.errorConnectionFailed') });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Maps Zustand state errors to localized error text
  const getSessionWarning = () => {
    if (authError === 'IP_MISMATCH') return t('auth.errorIpMismatch');
    if (authError === 'SESSION_EXPIRED') return t('auth.errorSessionExpired');
    if (authError === 'UNAUTHORIZED') return t('auth.errorUnauthorized');
    return null;
  };

  const warningMsg = getSessionWarning();

  return (
    <div className="relative min-h-screen w-full flex bg-background text-foreground overflow-hidden">
      {/* Brand Visual panel (Left Side) */}
      <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex-col justify-between p-12 overflow-hidden border-r border-border">
        {/* Animated Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse duration-[6000ms]" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse duration-[8000ms]" />

        {/* Portal Header */}
        <div className="flex items-center gap-3 z-10">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 backdrop-blur-md shadow-inner">
            <ShieldCheck className="size-6 text-primary" />
          </div>
          <span className="font-semibold text-sm tracking-wider uppercase bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
            Antigravity Admin
          </span>
        </div>

        {/* Brand visual quote/center graphics */}
        <div className="my-auto flex flex-col gap-6 max-w-lg z-10">
          <h1 className="text-4xl font-extrabold tracking-tight leading-none text-white drop-shadow-sm">
            {t('auth.portalTitle')}
          </h1>
          <div className="h-1.5 w-16 bg-gradient-to-r from-primary to-indigo-500 rounded-full" />
          <p className="text-slate-400 text-base font-medium leading-relaxed">
            {t('auth.brandSub')}
          </p>

          {/* Minimal stats badge overlay */}
          <div className="mt-8 p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md shadow-2xl flex items-center gap-4">
            <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
              <Laptop className="size-6 text-indigo-400" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">{t('auth.brandQuote')}</div>
              <div className="text-slate-500 text-xs mt-0.5">TLS 1.3 Active &bull; AES-256 Enabled</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-600 z-10 font-medium">
          &copy; {new Date().getFullYear()} Antigravity Dev Team. All rights reserved.
        </div>
      </div>

      {/* Login Screen Card Panel (Right Side) */}
      <div className="w-full md:w-1/2 flex flex-col justify-between p-8 md:p-12 bg-background relative z-10">
        {/* Top bar with Language Switcher */}
        <div className="flex justify-end w-full">
          <button
            type="button"
            onClick={toggleLanguage}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted hover:text-foreground transition-all duration-200 cursor-pointer select-none bg-background shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Toggle language"
          >
            <span className={i18n.language === 'en' ? 'text-primary font-bold' : 'text-muted-foreground'}>EN</span>
            <span className="text-muted-foreground/30">|</span>
            <span className={i18n.language === 'vi' ? 'text-primary font-bold' : 'text-muted-foreground'}>VI</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="my-auto mx-auto w-full max-w-sm flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            {/* Mobile Header Logo */}
            <div className="flex md:hidden items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
                <ShieldCheck className="size-5 text-primary" />
              </div>
              <span className="font-semibold text-xs tracking-wider uppercase text-primary">
                Antigravity Admin
              </span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {t('auth.loginTitle')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t('auth.loginSub')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {(warningMsg || errors.api) && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <AlertCircle className="size-4 shrink-0" />
                <span>{warningMsg || errors.api}</span>
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className={errors.email ? 'text-destructive' : ''}>
                {t('auth.emailLabel')}
              </Label>
              <Input
                id="email"
                type="text"
                placeholder={t('auth.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className={`h-10 ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
              {errors.email && (
                <span className="text-xs text-destructive font-medium mt-0.5">{errors.email}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className={errors.password ? 'text-destructive' : ''}>
                  {t('auth.passwordLabel')}
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder={t('auth.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className={`h-10 ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
              {errors.password && (
                <span className="text-xs text-destructive font-medium mt-0.5">{errors.password}</span>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-10 w-full font-semibold cursor-pointer shadow-md mt-2 transition-all hover:shadow-lg disabled:opacity-80 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin size-4 mr-2" />
                  {t('auth.loadingText')}
                </>
              ) : (
                t('auth.submitButton')
              )}
            </Button>
          </form>
        </div>

        {/* Mobile-only footer */}
        <div className="flex md:hidden text-center justify-center text-xs text-muted-foreground font-medium">
          &copy; {new Date().getFullYear()} Antigravity Dev Team.
        </div>
      </div>
    </div>
  );
}
