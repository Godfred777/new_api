import mongoose, { Document, Schema } from 'mongoose'

interface IArticle extends Document {
    title: Map<string, string>
    link: string
    content?: Map<string, string>
    contentSnippet?: string
    source?: string
    pubDate: Date
}

const ArticleSchema: Schema = new Schema({
    title: {type: Map, of: String, required: true},
    link: {type: String, required: true, unique: true},
    content: {type: Map, of: String},
    contentSnippet: String,
    pubDate: {type: Date, required: true},
    source: String
}) 

export const Article = mongoose.model<IArticle>('Article', ArticleSchema);