import mongoose from "mongoose";

const Tag = new mongoose.Schema({
    name: { type: String, required: true }
});

export default mongoose.models.Tag || mongoose.model("Tag", Tag);