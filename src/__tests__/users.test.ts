import { GET, POST } from "@/app/api/users/route";
import bcrypt from "bcryptjs";
import User from "@/models/User";

describe("API for User model", () => {
    it("Creates a user", async () => {
        const req = new Request("http://localhost/api/user", {
            method: "POST",
            body: JSON.stringify({
                firstName: "John",
                lastName: "Doe",
                email: "John.Doe@example.com",
                password: "HelloWorld"
            }),
            headers: { "Content-Type": "application/json" }
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(201);
        expect(res.fullName).toBe("John Doe");
        //? Below tests that the password is hashed in the same method as bcrypt 
        //? (not that the two strings are the same)
        expect(await bcrypt.compare("HelloWorld", res.password)).toBe(true);
    });

    it("Fetches all users", async () => {
        await User.create({ 
            firstName: "John",
            lastName: "Doe",
            email: "John.Doe@example.com",
            password: "HelloWorld"
        });

        const req = new Request("https://localhost/api/user", {
            method: "GET"
        });

        const res = await GET();
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.length).toBe(1);
        expect(json[0].fullName).toBe("John Doe");
    })
})