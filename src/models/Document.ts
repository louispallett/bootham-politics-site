import mongoose from "mongoose";
import Post from "./Post";
import User from "./User";

const Schema = mongoose.Schema;

const Document = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  uploader: { type: Schema.Types.ObjectId, ref: "User", required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  s3Key: { type: String, required: true },
  s3Bucket: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Document || mongoose.model("Document", Document);

// On s3 objects:
// Note that s3 objects are not like cloudinary - we don't store full URLs, as the URL might changed (and
// presigned ones ALWAYS change).
// Therefore, the KEY, is the only permanent identifier. A key might look like:
//
//  posts/65bc4a/documents/filename.pdf
//
//  Things like mimeType, size, and originalName aren't strictly necessary for what we are creating, however
//  they may be useful if we decide later to do something more complex with validation or UI stuff.
