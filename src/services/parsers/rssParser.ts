import Parser from 'rss-parser';
import { Article } from '../../models/Article';



const feedUrls = [
    'http://feeds.bbci.co.uk/news/rss.xml',
    'https://www.reutersagency.com/feed/?best-regions=world&post_type=best'
];


export async function fetchAllFeeds() {
    const parser = new Parser();
    const feedPromises = feedUrls.map(url => parser.parseURL(url));
    const feeds = await Promise.all(feedPromises);
  
    feeds.forEach(feed => {
      feed.items.forEach(item => {
        try {
          const article = new Article({
            title: item.title,
            link: item.link,
            content: item.content,
            pubDate: item.pubDate,
            source: item.source,
            image: item.image,
          });
          article.save();
        } catch (error) {
          console.error('Error saving article: ', error);
        }
      });
    });
}
