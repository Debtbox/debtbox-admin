import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { setDocDirection } from './utils/setDocDirection';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SessionExpiryPopup from './components/shared/SessionExpiryPopup';
import { useSessionStore } from './stores/SessionStore';
import { clearCookie } from './utils/storage';
import { queryClient } from './lib/queryClient';

function App() {
  const { i18n } = useTranslation();
  const { showSessionExpiryPopup, setShowSessionExpiryPopup } =
    useSessionStore();

  // Match the base path from vite.config.ts
  // For GitHub Pages subdirectory: '/debtbox-admin/'
  // For custom domain (admin.debtbox.sa): '/'
  const basename = import.meta.env.VITE_BASE_PATH || '/debtbox-admin/';

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setDocDirection(lng);
    };
    setDocDirection(i18n.language);
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const handleSessionRedirect = () => {
    setShowSessionExpiryPopup(false);
    clearCookie('access_token');
    queryClient.clear();
    localStorage.clear();
    window.location.replace(`${basename}auth/login`);
  };

  return (
    <BrowserRouter basename={basename}>
      <AppRoutes />
      <SessionExpiryPopup
        isOpen={showSessionExpiryPopup}
        onRedirect={handleSessionRedirect}
      />
    </BrowserRouter>
  );
}

export default App;
