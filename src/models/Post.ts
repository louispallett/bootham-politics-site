import mongoose from "mongoose";
import { DateTime } from "luxon";
const Schema = mongoose.Schema;

const Post = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
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