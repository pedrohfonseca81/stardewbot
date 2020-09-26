import { model, Document, Schema } from "mongoose";
import IWikiPost from "../../interfaces/wiki_post.interface";

type IWikiPostSchema = Document & IWikiPost;

const WikiPostSchema = new Schema({
    name: {
        type: String
    },
    category: {
        type: String,
    },
    link: {
        type: String,
    },
    content: {
        type: Array,
    },
    thumbnail_image_url: {
        type: String,
    },
    image_url: {
        type: String,
    },
    language: {
        type: String,
    }
});

const WikiPost = model<IWikiPostSchema>("posts", WikiPostSchema);

export default WikiPost