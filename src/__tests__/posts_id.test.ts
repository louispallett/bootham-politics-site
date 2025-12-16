import { GET, PUT } from "@/app/api/posts/[id]/route";
import { PUT as publishPUT } from "@/app/api/posts/[id]/update-publish/route";
import Post from "@/models/Post";
import User from "@/models/User";
import bcrypt from "bcryptjs";

describe("API for Post model (dynamic)", () => {
  let postId: string;

  beforeEach(async () => {
    const user = await User.create({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: await bcrypt.hash("HelloWorld1!", 12),
      passkey: process.env.PASS_KEY,
    });

    const post = await Post.create({
      title: "Test",
      synopsis: "Test synopsis",
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
    const form = new FormData();
    form.append("title", "Test title");
    form.append("banner-caption", "");
    form.append("synopsis", "Test synopsis");
    form.append("content", "Updated content");
    form.append("tags", "[]");

    const req = new Request(`http://localhost/api/posts/${postId}`, {
      method: "PUT",
      body: form,
    });

    const context = { params: { id: postId } };
    const res = await PUT(req, context);

    // PUT returns a 204, so doesn't return any data
    expect(res.status).toBe(204);
  });

  it("Publishes a post", async () => {
    const req = new Request(
      `http://localhost/api/posts/${postId}/update-publish`,
      {
        method: "PUT",
      },
    );

    const context = { params: { id: postId } };
    const res = await publishPUT(req, context);

    const post = await Post.findById(postId);
    expect(res.status).toBe(204);
    expect(post?.published).toBe(true);
  });
});
