import { Socket } from 'socket.io';
import { fetchAllFeeds } from './parsers/rssParser';

// Create a function that would emit feed data from the socket server
// In webSocketService.ts
export async function emitFeedData(socket: Socket) {
    try {
        const rawData = await fetchAllFeeds();
        
        // Convert MongoDB documents to plain objects
        const feeds = rawData?.map(doc => doc.toObject({ 
            virtuals: true,
            transform: (_, ret) => {
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        }));

        socket.emit('feeds', { data: feeds });
        
    } catch (error) {
        console.error('Emission error:', error);
        socket.emit('error', { message: 'Failed to load feeds' });
    }
}