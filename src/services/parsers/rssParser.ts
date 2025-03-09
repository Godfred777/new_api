import Parser from 'rss-parser';
import { Article } from '../../models/Article';
import { translate } from '../translation';



const feedUrls = [
    'http://feeds.bbci.co.uk/news/rss.xml',
    'https://ir.thomsonreuters.com/rss/news-releases.xml?items=15',
    'https://ir.thomsonreuters.com/rss/events.xml?items=15',
    'https://rss.app/feeds/EYs0ADiO5vo7soom.xml',
    'https://rss.app/feeds/0UB6a3TrjPwAaIlg.xml',
    'https://www.cgtn.com/subscribe/rss/section/china.xml',
    'https://www.cgtn.com/subscribe/rss/section/world.xml',
    'https://www.senenews.com/rss/rss-all.xml',
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
                          title: {
                            en: item.title,
                            es: translate(item.title as string, 'es'),
                            fr: translate(item.title as string, 'fr'),
                            de: translate(item.title as string, 'de')
                          },
                          link: item.link,
                          pubDate: item.pubDate,
                          content: {
                            en: item.content,
                            es: translate(item.content as string, 'es'),
                            fr: translate(item.content as string, 'fr'),
                            de: translate(item.content as string, 'de')
                          },
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
  return await Article.find().sort({ pubDate: -1 }).limit(50);
  } catch (error) {
    console.error('Error fetching feeds:', error);
  }
}