import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to Vietnam Tourism",
      "search": "Search",
      // Add more English keys here
    }
  },
  vi: {
    translation: {
      "welcome": "Chào mừng đến với Du lịch Việt Nam",
      "search": "Tìm kiếm",
      // Add more Vietnamese keys here
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
