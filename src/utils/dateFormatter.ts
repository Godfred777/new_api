// utils/dateFormatter.ts
import { format, parseISO, Locale } from 'date-fns';
import { enUS, es, fr, de } from 'date-fns/locale';

const locales: { [key: string]: Locale } = {
  en: enUS,
  es: es,
  fr: fr,
  de: de
};

export const localizeDate = (dateString: string, lang: string = 'en') => {
  const date = parseISO(dateString);
  return format(date, 'PPPp', {
    locale: locales[lang] || enUS
  });
};