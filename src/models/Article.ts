import mongoose, { Document, Schema } from 'mongoose'

interface IArticle extends Document {
    title: string
    link: string
    content?: string
    contentSnippet?: string
    source: string
    pubDate: Date
}

const ArticleSchema: Schema = new Schema({
    title: {type: String, required: true},
    link: {type: String, required: true, unique: true},
    content: String,
    contentSnippet: String,
    pubDate: {type: Date, required: true},
    source: {type: String, required: true}
}) 

export const Article = mongoose.model<IArticle>('Article', ArticleSchema);