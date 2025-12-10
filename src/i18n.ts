import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ICU from 'i18next-icu';
import HttpApi from 'i18next-http-backend';
import { getLanguageFromCookie } from './utils/getLanguageFromCookies';

const i18nConfig = i18n
  .use(ICU)
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    lng: getLanguageFromCookie(),
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],
    detection: {
      order: ['cookie'],
      caches: [],
    },
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}.json',
    },
  });

export default i18nConfig;
