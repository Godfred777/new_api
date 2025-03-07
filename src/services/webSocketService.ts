import { Socket } from 'socket.io';
import { fetchAllFeeds } from './parsers/rssParser';
import { time } from 'console';

// Create a function that would emit feed data from the socket server
export async function emitFeedData(socket: Socket) {
    try {
        const feeds = fetchAllFeeds();``
        socket.emit('feeds', feeds);
    } catch (error) {
        console.error('Error emitting feed data:', error);
        socket.emit('error', 'Error emitting feed data');
    } 
}