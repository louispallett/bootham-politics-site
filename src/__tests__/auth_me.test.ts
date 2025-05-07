import { GET } from "@/app/api/auth/me/route";
import { POST } from "@/app/api/auth/route";
import User from "@/models/User";
import bcrypt from "bcryptjs";

describe("Auth ME route (authentication)", () => {
    let token:string;
    beforeEach(async () => {
        const user = await User.create({
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: await bcrypt.hash("HelloWorld1!", 12),
            passkey: process.env.PASS_KEY
        });
        const req = new Request("http:localhost/api/auth", {
            method: "POST",
            body: JSON.stringify({
                email: "john.doe@example.com",
                password: "HelloWorld1!"
            }),
            headers: { "Content-Type": "application/json" }
        });
        const res = await POST(req);
        const json = await res.json();

        token = json.token;
    });

    it("Successful on valid JWT", async () => {
        const req = new Request("http:localhost/api/auth/me", {
            method: "GET", 
            headers: { Authorization: "Bearer " + token }
        });

        const res = await GET(req);

        expect(res.status).toBe(200);
    });

    it("Unsuccessful on invalid JWT", async () => {
        const req = new Request("http:localhost/api/auth/me", {
            method: "GET", 
            headers: { Authorization: "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODFiYjMzZmNiODhhNmFmOWQzYmNjNzUiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwiaWF0IjoxNzQ2NjQ1ODI0LCJleHAiOjE3NDY3NzU0MjR9.gSwoPjf3lc6BuaPG7UL9hxrkg7wnjDBH7es9RfbmNn1" }
        });

        const res = await GET(req);
        const json = await res.json();

        expect(res.status).toBe(401);
        expect(json.message).toBe("Invalid token");
    });
});