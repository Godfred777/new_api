import express, { Express } from "express";
import BodyParser from "body-parser";

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
  return app;
}