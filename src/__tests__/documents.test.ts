import Document from "@/models/Document";
import { GET } from "@/app/api/documents/route";
import mongoose from "mongoose";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

describe("API for Document route", () => {
  beforeEach(async () => {
    await Document.create({
      postId: new mongoose.Types.ObjectId(),
      uploader: new mongoose.Types.ObjectId(),
      originalName: "test.pdf",
      mimeType: "application/pdf",
      size: "1000",
      s3Key: "abc",
      s3Bucket: "testBucket",
    });
  });

  

  it("Fetches all documents", async () => {
    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.length).toBe(1);
    expect(json[0].originalName).toBe("test.pdf");
  });
});
