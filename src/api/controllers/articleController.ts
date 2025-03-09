// controllers/articles.ts
import { formatError } from '../../utils/errorFormatter';
import { Article } from '../../models/Article';
import { Request, Response } from 'express';

export const getArticles = async (req: Request, res: Response) => {
  try {
    const articles = await Article.find().sort({ pubDate: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json(formatError(req, error));
  }
};