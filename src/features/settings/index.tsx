import { useTranslation } from 'react-i18next';
import { Settings as SettingsIcon, User, Bell, Shield } from 'lucide-react';

const Settings = () => {
  const { t } = useTranslation();

  const settingsSections = [
    {
      title: t('settings.profile', 'Profile Settings'),
      icon: User,
      description: t('settings.profileDescription', 'Manage your account information'),
    },
    {
      title: t('settings.notifications', 'Notifications'),
      icon: Bell,
      description: t('settings.notificationsDescription', 'Configure notification preferences'),
    },
    {
      title: t('settings.security', 'Security'),
      icon: Shield,
      description: t('settings.securityDescription', 'Manage security settings and passwords'),
    },
    {
      title: t('settings.system', 'System Settings'),
      icon: SettingsIcon,
      description: t('settings.systemDescription', 'Configure system-wide settings'),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('settings.title', 'Settings')}
        </h1>
        <p className="text-gray-600 mt-1">
          {t('settings.subtitle', 'Manage your account and system settings')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Placeholder for settings content */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t('settings.general', 'General Settings')}
        </h2>
        <p className="text-gray-500 text-center py-8">
          {t('settings.comingSoon', 'Settings configuration will be available here')}
        </p>
      </div>
    </div>
  );
};

export const SettingsRoutes = () => {
  return <Settings />;
};
