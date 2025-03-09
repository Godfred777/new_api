import express, { Express } from "express";
import BodyParser from "body-parser";
import { languageMiddleware } from "./config/i18n";
import { formatResponse } from "./api/middleware/responseFormatter";

export function createApp(
    config: { 
        port: number,
        host: string,
        env: string,
    },
): Express {
  const app = express();

  app.set('port', config.port);
  app.set('host', config.host);
  app.set('env', config.env);

  app.use(BodyParser.json());
  app.use(languageMiddleware)
  app.use(formatResponse);


  return app;
}