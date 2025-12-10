import Cookies from 'js-cookie';

export const getLanguageFromCookie = (): string => {
  const lang = Cookies.get('i18next');
  return lang || 'en';
};
