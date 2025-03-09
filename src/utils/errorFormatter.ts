// utils/errorFormatter.ts
import { Request } from 'express';
import i18next from 'i18next';

export const formatError = (req: Request, error: any) => {
  const lang = (req as any).language || 'en';
  
  return {
    code: error.code,
    message: i18next.t(`errors.${error.code}`, { lng: lang }),
    details: error.details
  };
};