import { GET, POST } from "@/app/api/tags/route";
import { PUT } from "@/app/api/tags/[id]/route";
import Tag from "@/models/Tag";
import { TagType } from "@/lib/types";
import {NextRequest} from "next/server";

describe("API for Tag model", () => {
  it("Creates a tag", async () => {
    const req = new Request("http://localhost/api/tags", {
      method: "POST",
      body: JSON.stringify({
        name: "British Politics",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.name).toBe("British Politics");
  });

  describe("API for Tag model (2)", () => {
    let createdTag: TagType;
    beforeEach(async () => {
      createdTag = await Tag.create({
        name: "British Politics",
      });
    });

    it("Gets all tags", async () => {
      new Request("http://localhost/api/tags", {
        method: "GET",
      });

      const res = await GET();
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.tags[0].name).toBe("British Politics");
    });

    it("Throws error if Tag already exists", async () => {
      const req = new Request("http://localhost/api/tags", {
        method: "POST",
        body: JSON.stringify({
          name: "British Politics",
        }),
        headers: { "Content-Type": "application/json" },
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(409);
      expect(json.message).toBe("Tag already exists");
    });

    it("Updates a tag", async () => {
      const req = new Request(`http://localhost/api/tags/${createdTag._id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: "Irish Politics",
        }),
        headers: { "Content-Type": "application/json" },
      });

      const context = { params: Promise.resolve({ id: createdTag._id.toString() }) };
      const nextReq = new NextRequest(req);
      const res = await PUT(nextReq, context);

      expect(res.status).toBe(204);
    });
  });
});
