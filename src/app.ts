import { createApp } from './server';
import dotenv from 'dotenv';
import { connectToDatabase } from './models/database';
import { initSocketServer } from './socket/socketServer';


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


//connectToDatabase(process.env.MONGODB_URI as string);

server.on('error', (error) => {
    console.log("Error: " + error);
})

server.listen(port, host, () => {
    console.log(`HTTP/WebSocket server running on:
    - HTTP: http://${host}:${port}
    - WebSocket: ws://${host}:${port}/socket.io/`);
    connectToDatabase(process.env.MONGODB_URI as string);
});