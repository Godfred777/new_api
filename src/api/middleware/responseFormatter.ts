// middleware/responseFormatter.ts
import { Request, Response, NextFunction } from 'express';
import { localizeDate } from '../../utils/dateFormatter';

export const formatResponse = (req: Request, res: Response, next: NextFunction) => {
  const oldJson = res.json;
  const lang = (req as any).language || 'en';
  
  res.json = function(data) {
    const processedData = Array.isArray(data) 
      ? data.map(item => processItem(item, lang))
      : processItem(data, lang);
      
    res.setHeader('Content-Language', lang);
    return oldJson.call(this, processedData);
  };
  
  next();
};

function processItem(item: any, lang: string) {
  return {
    ...item,
    title: item.title?.get(lang) || item.title?.get('en'),
    content: item.content?.get(lang) || item.content?.get('en'),
    pubDate: localizeDate(item.pubDate, lang)
  };
}