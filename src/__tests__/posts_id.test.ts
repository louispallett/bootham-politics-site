import { GET, PUT } from "@/app/api/posts/[id]/route";
import Post from "@/models/Post";
import User from "@/models/User";
import bcrypt from "bcryptjs";

describe("API for Post model (dynamic)", () => {
    let postId:string;

    beforeEach(async () => {
        const user = await User.create({
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: await bcrypt.hash("HelloWorld1!", 12),
            passkey: process.env.PASS_KEY
        });

        const post = await Post.create({
            title: "Test",
            content: "Testy content",
            author: user._id,
            tags: [],
        });

        postId = post._id;
    });

    it("Fetches post by id", async () => {
        const req = new Request(`http://localhost/api/posts/${postId}`, {
            method: "GET",
        });

        const context = { params: { id: postId } };
        const res = await GET(req, context);
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.title).toBe("Test");
    });

    it("Updates a post", async () => {
        const req = new Request(`http://localhost/api/posts/${postId}`, {
            method: "PUT",
            body: JSON.stringify({ 
                title: "Test Post", 
                content: "Updated content",
                published: false
            }),
            headers: { "Content-Type": "application/json" }
        });

        const context = { params: { id: postId }}
        const res = await PUT(req, context);

        expect(res.status).toBe(204);
    });
});