import mongoose from "mongoose";
import Post from "./Post";

const User = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

User.virtual("fullname").get(function() {
    return `${this.firstName} ${this.lastName}`;
});

User.set("toJSON", { virtuals: true });

export default mongoose.models.User || mongoose.model("User", User);