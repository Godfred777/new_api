import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { RequestHandler } from 'express';
import path from 'path';

// Initialize i18next
i18next
  .use(Backend)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'fr', 'de'], // Add more languages
    backend: {
      loadPath: path.join(__dirname, '../locales/{{lng}}/translation.json'),
    },
    interpolation: {
      escapeValue: false,
    },
    preload: ['en', 'fr'] // Preload these languages
  });

// Middleware for language detection
export const languageMiddleware: RequestHandler = (req, res, next) => {
  const lang = req.query.lang || req.acceptsLanguages([...i18next.languages]) || 'en';
  i18next.changeLanguage(lang.toString());
  (req as any).language = lang;
  next();
};