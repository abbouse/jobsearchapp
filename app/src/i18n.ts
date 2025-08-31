import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './locales/en';
import { uz } from './locales/uz';
import { jp } from './locales/jp';

const resources = {
  en,
  uz,
  jp,
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'uz', // Default til
  fallbackLng: 'uz',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;