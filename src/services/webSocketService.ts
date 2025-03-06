import { Socket } from 'socket.io';
import { fetchAllFeeds } from './parsers/rssParser';

// Create a function that would emit feed data from the socket server
export async function emitFeedData(socket: Socket) {
    try {

        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject('Timeout');
            }, 30000);
        });

        const feedPromise = fetchAllFeeds();

        const feeds = await Promise.race([feedPromise, timeoutPromise]);

        socket.emit('feeds', feeds);
    } catch (error) {
        console.error('Error emitting feed data:', error);
        socket.emit('error', 'Error emitting feed data');
    }
}