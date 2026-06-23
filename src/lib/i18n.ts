import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      sidebar: {
        dashboard: 'Dashboard',
        rbacAccess: 'RBAC Access',
        adminConsole: 'Admin Console',
      },
      header: {
        welcome: 'Welcome to Business Chat Admin Console',
        language: 'Language',
      },
      dashboard: {
        title: 'Dashboard Overview',
        description: 'Welcome to the Business Chat Admin Control Panel.',
        kpis: {
          totalUsers: 'Total Users',
          activeRoles: 'Active Roles',
          activeSessions: 'Active Sessions',
          apiTraffic: 'API Traffic',
        },
        trends: {
          usersSub: '+1 joined today',
          rolesSub: 'Admin, Moderator, User',
          sessionsSub: '100% system uptime',
          trafficSub: '+8.2% vs yesterday',
          live: 'Live now',
        },
        charts: {
          trafficTitle: 'API Request Volume',
          trafficSub: 'Request volume over the last 7 days',
          sessionsTitle: 'Hourly Sessions',
          sessionsSub: 'Recorded user sessions by hour',
          requests: 'Requests',
          sessions: 'Sessions',
          days: {
            mon: 'Mon',
            tue: 'Tue',
            wed: 'Wed',
            thu: 'Thu',
            fri: 'Fri',
            sat: 'Sat',
            sun: 'Sun',
          },
        },
      },
      rbac: {
        title: 'RBAC Management',
        description: 'Manage user roles, access control claims, and system permissions.',
        directory: {
          title: 'User Directory',
          description: 'Overview of registered team members and their active roles.',
          searchPlaceholder: 'Search by name or email...',
          columns: {
            user: 'User',
            email: 'Email',
            role: 'Role',
            status: 'Status',
            joinedDate: 'Joined Date',
            actions: 'Actions',
          },
          actions: {
            editRole: 'Edit Role',
          },
          emptyState: {
            title: 'No users found',
            description: 'Try adjusting your search query or role filter.',
          },
        },
        matrix: {
          title: 'Role Permission Matrix',
          description: 'Access control matrix displaying authorized capability claims by role.',
          claimHeader: 'Capability Claim',
          readMessages: 'Allows reading conversation threads and message logs.',
          writeMessages: 'Allows sending messages and creating new chat channels.',
          manageRoles: 'Allows assigning roles and modifying permission matrices.',
          adminAll: 'Full administrative override capability across all systems.',
        },
        modal: {
          title: 'Edit User Role',
          description: 'Update authorization privileges and capability claims for this team member.',
          nameLabel: 'User Name',
          emailLabel: 'Email Address',
          currentRoleLabel: 'Current Role',
          assignRoleLabel: 'Assign System Role',
          options: {
            user: 'User (Standard Access)',
            moderator: 'Moderator (Elevated Access)',
            admin: 'Admin (Full Control)',
          },
          cancel: 'Cancel',
          save: 'Save Changes',
        },
      },
    },
  },
  vi: {
    translation: {
      sidebar: {
        dashboard: 'Bảng điều khiển',
        rbacAccess: 'Quyền truy cập RBAC',
        adminConsole: 'Trang Quản trị',
      },
      header: {
        welcome: 'Chào mừng đến với Trang Quản trị Business Chat',
        language: 'Ngôn ngữ',
      },
      dashboard: {
        title: 'Tổng quan Hệ thống',
        description: 'Chào mừng đến với Bảng Quản trị Business Chat.',
        kpis: {
          totalUsers: 'Tổng số Người dùng',
          activeRoles: 'Vai trò Hoạt động',
          activeSessions: 'Phiên hoạt động',
          apiTraffic: 'Lưu lượng API',
        },
        trends: {
          usersSub: '+1 thành viên mới hôm nay',
          rolesSub: 'Quản trị, Kiểm duyệt, Thành viên',
          sessionsSub: 'Thời gian hoạt động 100%',
          trafficSub: '+8.2% so với hôm qua',
          live: 'Đang hoạt động',
        },
        charts: {
          trafficTitle: 'Lưu lượng yêu cầu API',
          trafficSub: 'Số lượng yêu cầu trong 7 ngày qua',
          sessionsTitle: 'Phiên hoạt động theo giờ',
          sessionsSub: 'Số lượng phiên hoạt động theo khung giờ',
          requests: 'Yêu cầu',
          sessions: 'Phiên',
          days: {
            mon: 'T2',
            tue: 'T3',
            wed: 'T4',
            thu: 'T5',
            fri: 'T6',
            sat: 'T7',
            sun: 'CN',
          },
        },
      },
      rbac: {
        title: 'Quản lý RBAC',
        description: 'Quản lý vai trò người dùng, yêu cầu kiểm soát truy cập và phân quyền hệ thống.',
        directory: {
          title: 'Danh bạ Người dùng',
          description: 'Tổng quan về các thành viên đã đăng ký và vai trò hiện tại của họ.',
          searchPlaceholder: 'Tìm kiếm theo tên hoặc email...',
          columns: {
            user: 'Người dùng',
            email: 'Email',
            role: 'Vai trò',
            status: 'Trạng thái',
            joinedDate: 'Ngày tham gia',
            actions: 'Hành động',
          },
          actions: {
            editRole: 'Sửa vai trò',
          },
          emptyState: {
            title: 'Không tìm thấy người dùng',
            description: 'Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc vai trò.',
          },
        },
        matrix: {
          title: 'Ma trận Phân quyền Vai trò',
          description: 'Ma trận kiểm soát truy cập hiển thị các quyền hạn được cấp theo từng vai trò.',
          claimHeader: 'Quyền hạn Hệ thống',
          readMessages: 'Cho phép đọc các cuộc trò chuyện và lịch sử tin nhắn.',
          writeMessages: 'Cho phép gửi tin nhắn và tạo kênh chat mới.',
          manageRoles: 'Cho phép gán vai trò và điều chỉnh ma trận quyền.',
          adminAll: 'Toàn quyền quản trị tối cao trên toàn bộ hệ thống.',
        },
        modal: {
          title: 'Thay đổi Vai trò Thành viên',
          description: 'Cập nhật đặc quyền cấp phép và phân quyền truy cập hệ thống cho thành viên này.',
          nameLabel: 'Tên thành viên',
          emailLabel: 'Địa chỉ Email',
          currentRoleLabel: 'Vai trò hiện tại',
          assignRoleLabel: 'Gán vai trò mới',
          options: {
            user: 'Thành viên (Quyền cơ bản)',
            moderator: 'Kiểm duyệt viên (Quyền nâng cao)',
            admin: 'Quản trị viên (Toàn quyền)',
          },
          cancel: 'Hủy bỏ',
          save: 'Lưu thay đổi',
        },
      },
    },
  },
};

const savedLng = localStorage.getItem('i18nextLng') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLng,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
