import { GET } from "@/app/api/posts/[id]/route";
import Post from "@/models/Post";

describe("API for Post model (dynamic)", () => {
    it("Fetches post by id", async () => {
        const post = await Post.create({ title: "Test", content: "Test content" });
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