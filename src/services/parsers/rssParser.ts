import Parser from 'rss-parser';
import cron from 'node-cron';


const feedUrls = [
    'http://feeds.bbci.co.uk/news/rss.xml',
    'https://www.reutersagency.com/feed/?best-regions=world&post_type=best'
  ];

const parser = new Parser()
  
async function fetchAllFeeds() {
    const feedPromises = feedUrls.map(url => parser.parseURL(url));
    const feeds = await Promise.all(feedPromises);
  
    feeds.forEach(feed => {
      feed.items.forEach(item => {
        // Process each item
      });
    });
}
  

  // Schedule tasks to run every 5 minutes
cron.schedule('*/5 * * * *', () => {
    fetchAllFeeds();
});
  