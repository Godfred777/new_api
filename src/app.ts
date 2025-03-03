import express from 'express';
import { createApp } from './index';
import dotenv from 'dotenv';


dotenv.config();

const port = parseInt(process.env.PORT as string) || 3000;
const host = process.env.HOST || 'localhost';
const env = process.env.NODE_ENV || 'development';

const config = {
    port,
    host,
    env,
}

const app = createApp(config);
app.listen(config.port, () => {
    console.log(`Server running at http://${config.host}:${config.port}`);
});
