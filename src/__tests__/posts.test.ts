import { GET, POST } from "@/app/api/posts/route";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import Post from "@/models/Post";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { PostType } from "@/lib/types";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

describe("API for Post route", () => {
  let id: string;
  beforeEach(async () => {
    const user = await User.create({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: await bcrypt.hash("HelloWorld1!", 12),
      passkey: process.env.PASS_KEY,
    });

    id = user._id;
  });

  describe("API for Post model(1)", () => {
    it("Creates a post", async () => {
      const token = jwt.sign({ userId: id }, process.env.JWT_SECRET!);
      (cookies as jest.Mock).mockReturnValue({
        get: (name: string) => {
          if (name === "token") {
            return { value: token };
          }
          return undefined;
        },
      });

      const form = new FormData();
      form.append("title", "Test title");
      form.append("banner-caption", "");
      form.append("synopsis", "Test synopsis");
      form.append("content", "Test content");
      form.append("tags", "[]");

      const req = new Request("http://localhost/api/posts", {
        method: "POST",
        body: form,
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.title).toBe("Test title");
      expect(json.content).toBe("Test content");
    });
  });

  describe("API for Post model(2)", () => {
    let post: PostType;
    beforeAll(async () => {
      post = await Post.create({
        title: "Test",
        synopsis: "Test synopsis",
        content: "Test content",
        author: id,
      });
    });

    it("Gets all posts", async () => {
      const res = await GET();
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.length).toBe(1);
      expect(json[0].content).toBe("Test content");
    });
  });
});
