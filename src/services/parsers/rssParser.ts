import Parser from 'rss-parser';
import { Article } from '../../models/Article';


const feedUrls = [
   // 'https://rss.app/feeds/QWstunB5dW93zouY.xml',
  //  'https://rss.app/feeds/82fYOxUR6iB8aOpS.xml',
    'http://feeds.bbci.co.uk/news/rss.xml',
    'https://ir.thomsonreuters.com/rss/news-releases.xml?items=15',
    'https://ir.thomsonreuters.com/rss/events.xml?items=15',
];


const parser = new Parser({
  timeout: 10000, // 10 seconds
  headers: {
    'User-Agent': 'RSS Feed Parser',
  }
});


async function fetchFeedWithRetry(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await parser.parseURL(url);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}


// Fetch all feeds and save the articles to the database
export async function fetchAllFeeds() {
    try {
      const feedPromises = feedUrls.map(url => fetchFeedWithRetry(url).catch(error => console.error(`Error fetching feed from ${url}:`, error)));
      const feeds = await Promise.allSettled(feedPromises);
    
      for (const result of feeds) {
        if (result.status === 'fulfilled' && result.value) {
          await Promise.allSettled(
            result.value.items?.map(async (item) => {
              try {
                  await Article.findOneAndUpdate(
                      { link: item.link },
                      { 
                          title: item.title,
                          link: item.link,
                          pubDate: item.pubDate,
                          content: item.content,
                          source: item.source?.toString(),
                          isoDate: item.isoDate,
                          image: item.image
                       },
                      { upsert: true, new: true }
                  );
              } catch (error) {
                  console.error('DB Error:', error);
              }
          })
      );
      }

  }
  return await Article.find().sort({ pubDate: -1 }).limit(10);
  } catch (error) {
    console.error('Error fetching feeds:', error);
  }
}