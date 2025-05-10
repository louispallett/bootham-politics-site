import { GET } from "@/app/api/posts/[id]/route";
import Post from "@/models/Post";
import User from "@/models/User";
import bcrypt from "bcryptjs";

describe("API for Post model (dynamic)", () => {
    let id:string;
    beforeEach(async () => {

        const user = await User.create({
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: await bcrypt.hash("HelloWorld1!", 12),
            passkey: process.env.PASS_KEY
        });

        id = user._id;
    });

    it("Fetches post by id", async () => {
        const post = await Post.create({ 
            title: "Test", 
            content: "Test content", 
            author: id 
        });
        const req = new Request(`http://localhost/api/posts/${post._id}`, {
            method: "GET",
        });

        const context = { params: { id: post._id.toString() } };
        const res = await GET(req, context);
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.title).toBe("Test");
    });
});