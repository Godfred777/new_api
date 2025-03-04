import { createApp } from './server';
import dotenv from 'dotenv';
import { connectToDatabase } from './models/database';
import cron from 'node-cron';
import { fetchAllFeeds } from './services/parsers/rssParser';


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

connectToDatabase(process.env.MONGODB_URI as string);

// Schedule tasks to run every 5 minutes
cron.schedule('*/5 * * * *', () => {
    fetchAllFeeds();
});
  

app.listen(config.port, () => {
    console.log(`Server running at http://${config.host}:${config.port}`);
});
