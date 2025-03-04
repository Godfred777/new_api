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
    
      feeds.forEach(feed => {
        feed.items.forEach(async (item) => {
          try {
            await Article.findOneAndUpdate(
              { link: item.link }, // search criteria
              {   // update data
                  title: item.title,
                  link: item.link,
                  content: item.content,
                  pubDate: item.pubDate,
                  source: item.source,
                  image: item.image,
              },
              {
                  upsert: true, // create if doesn't exist
                  new: true, // return the updated document
              }
          );
          } catch (error) {
            console.error('Error saving article: ', error);
          }
        });
      });
    } catch (error) {
      console.error('Error fetching feeds: ', error);
    }
}
