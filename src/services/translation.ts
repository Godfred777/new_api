// src/services/translation.ts
import i18next from 'i18next';

export function translate(text: string, lng: string) {
  return i18next.t(text, { lng, fallbackLng: 'en' });
}