import { createApp } from './server';
import dotenv from 'dotenv';
import { connectToDatabase } from './models/database';
import { initSocketServer } from './socket/socketServer';
import { emitFeedData } from './services/webSocketService';


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
const server = initSocketServer(app);


connectToDatabase(process.env.MONGODB_URI as string);

server.on('error', (error) => {
    console.log("Error: " + error);
})

server.listen(port, () => {
    console.log(`Server is running on ws://${host}:${port}`);
});