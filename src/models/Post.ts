import mongoose from "mongoose";
import User from "./User";
import { DateTime } from "luxon";
const Schema = mongoose.Schema;

const Post = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    published: { type: Boolean, default: false, required: true },
    creationDate: { 
        type: Date,
        required: true,
        default: () => new Date(),
        immutable: true
    }
});

Post.virtual("creationDateFormatted").get(function() {
    return DateTime.fromJSDate(this.creationDate).toLocaleString(DateTime.DATE_MED);
});

Post.set("toJSON", { virtuals: true });

export default mongoose.models.Post || mongoose.model("Post", Post);