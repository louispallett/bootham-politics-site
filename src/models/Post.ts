import mongoose from "mongoose";
import { DateTime } from "luxon";

const Post = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
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