// types/rss-parser.d.ts
declare module 'rss-parser' {
  export interface FeedItem {
    title?: string;
    link?: string;
    pubDate?: string;
    content?: string;
    source?: string;
    isoDate?: string;
    image?: string;
    // Add other fields as needed
  }

  export interface Feed {
    items: FeedItem[];
  }

  export default class Parser {
    constructor(options?: any);
    parseURL(url: string): Promise<Feed>;
    parseString(xml: string): Promise<Feed>;
  }
}