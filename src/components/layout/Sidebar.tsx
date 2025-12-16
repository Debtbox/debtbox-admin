import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { LayoutDashboard, Users, Store, Settings, Building2, UserCog, DollarSign } from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle?: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const Sidebar = ({ isCollapsed = true, onToggle }: SidebarProps) => {
  const { t } = useTranslation();
  const location = useLocation();

  const navigation: NavItem[] = [
    {
      name: t('navigation.dashboard', 'Dashboard'),
      href: '/',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: t('navigation.businessApprovals', 'Business Approvals'),
      href: '/business-approvals',
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      name: t('navigation.userManagement', 'User Management'),
      href: '/user-management',
      icon: <UserCog className="w-5 h-5" />,
    },
    {
      name: t('navigation.money', 'Money & Profits'),
      href: '/money',
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      name: t('navigation.customers', 'Customers'),
      href: '/customers',
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: t('navigation.merchants', 'Merchants'),
      href: '/merchants',
      icon: <Store className="w-5 h-5" />,
    },
    {
      name: t('navigation.settings', 'Settings'),
      href: '/settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div
      className={clsx(
        isCollapsed ? 'w-16' : 'w-64',
        'bg-white border-r border-gray-200 relative flex flex-col transition-all duration-300 h-screen',
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-center p-4 border-b border-gray-200">
        {!isCollapsed && (
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DA</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Debtbox Admin</span>
          </Link>
        )}
        {isCollapsed && (
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">DA</span>
          </div>
        )}
      </div>

      <nav className="flex-1 px-2 py-4 space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={clsx(
              'group flex items-center px-3 py-3 font-medium rounded-lg transition-all duration-200',
              isActive(item.href)
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            )}
            title={isCollapsed ? item.name : undefined}
            onClick={onToggle}
          >
            <span
              className={clsx(
                isCollapsed ? '' : 'me-3',
                'flex-shrink-0',
                isActive(item.href) ? 'text-white' : 'text-gray-600',
              )}
            >
              {item.icon}
            </span>
            {!isCollapsed && (
              <>
                <span className="flex-1">{item.name}</span>
              </>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
