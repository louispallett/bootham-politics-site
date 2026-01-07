import { POST } from "@/app/api/auth/route";
import { PUT as detailsPUT } from "@/app/api/auth/update/details/route";
import { PUT as passwordPUT } from "@/app/api/auth/update/password/route";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

describe("Auth ID route (account alterations)", () => {
  let token: string;
  beforeEach(async () => {
    await User.create({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: await bcrypt.hash("HelloWorld1!", 12),
      passkey: process.env.PASS_KEY,
    });

    const req = new Request("http:localhost/api/auth", {
      method: "POST",
      body: JSON.stringify({
        email: "john.doe@example.com",
        password: "HelloWorld1!",
      }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    const json = await res.json();

    token = json.token;
  });

  it("Changes account information", async () => {
    const cookieHeader = `token=${token}`;

    const req = new Request("http://localhost/api/auth/update/details", {
      method: "PUT",
      headers: {
        cookie: cookieHeader,
      },
      body: JSON.stringify({
        firstName: "Jane",
        lastName: "Dane",
        email: "jane.dane@example.com",
      }),
    });

    const nextReq = new NextRequest(req);
    const res = await detailsPUT(nextReq);

    expect(res.status).toBe(204);
  });

  it("Changes account password", async () => {
    const cookieHeader = `token=${token}`;

    const req = new Request("http://localhost/api/auth/update/password", {
      method: "PUT",
      headers: {
        cookie: cookieHeader,
      },
      body: JSON.stringify({
        currentPassword: "HelloWorld1!",
        newPassword: "HelloWorld123!"
      })
    });

    const nextReq = new NextRequest(req);
    const res = await passwordPUT(nextReq);

    expect(res.status).toBe(204);
  });
});
