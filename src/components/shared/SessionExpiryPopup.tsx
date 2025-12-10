import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';

interface SessionExpiryPopupProps {
  isOpen: boolean;
  onRedirect: () => void;
}

const SessionExpiryPopup = ({ isOpen, onRedirect }: SessionExpiryPopupProps) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="w-6 h-6 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            {t('session.expired', 'Session Expired')}
          </h3>
        </div>
        <p className="text-gray-600 mb-6">
          {t('session.expiredMessage', 'Your session has expired. Please log in again.')}
        </p>
        <button
          onClick={onRedirect}
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
        >
          {t('common.buttons.login', 'Login')}
        </button>
      </div>
    </div>
  );
};

export default SessionExpiryPopup;
