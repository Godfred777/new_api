import Parser from 'rss-parser';
import { Article } from '../../models/Article';


const feedUrls = [
   // 'https://rss.app/feeds/QWstunB5dW93zouY.xml',
  //  'https://rss.app/feeds/82fYOxUR6iB8aOpS.xml',
    'http://feeds.bbci.co.uk/news/rss.xml',
    'https://ir.thomsonreuters.com/rss/news-releases.xml?items=15',
    'https://ir.thomsonreuters.com/rss/events.xml?items=15',
];

// Fetch all feeds and save the articles to the database
export async function fetchAllFeeds() {
    try {
      const parser = new Parser();
      const feedPromises = feedUrls.map(url => parser.parseURL(url));
      const feeds = await Promise.all(feedPromises);
    
      for (const feed of feeds) {
        await Promise.allSettled(
          feed.items.map(async (item) => {
              try {
                  await Article.findOneAndUpdate(
                      { link: item.link },
                      { 
                          title: item.title,
                          link: item.link,
                          pubDate: item.pubDate,
                          content: item.content,
                          source: item.source,
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

    } catch (error) {
      console.error('Error fetching feeds:', error);
      return [];
    }
  }