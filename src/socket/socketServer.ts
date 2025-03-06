import {createServer} from 'http';
import {Server} from 'socket.io';
import { Express } from 'express';
import { emitFeedData } from '../services/webSocketService';

//Create a function that would initialize the socket server
export function initSocketServer(app: Express) {
    const httpServer = createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        },
        pingTimeout: 60000,
        maxHttpBufferSize: 1e8,
        transports: ['websocket', 'polling']
    });

    io.on('connection', async (socket) => {
        console.log('A user connected');

        // Emit feed data to the client
        const safeFeedEmission = async () => {
            try {
                emitFeedData(socket);
            } catch (error) {
                console.error('Error emitting feed data:', error);
            }
        };

        await safeFeedEmission();

        const interval = setInterval(() => {
            safeFeedEmission();
        }, 300000); // 5 minutes


        socket.on('disconnect', () => {
            console.log('User disconnected');
            clearInterval(interval);
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
            clearInterval(interval);
        });
    });


    return httpServer;
}