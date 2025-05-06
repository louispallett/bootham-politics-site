import { POST } from "@/app/api/auth/route";
import User from "@/models/User";

beforeAll(async () => {
    await User.create({
        firstName: "John",
        lastName: "Doe",
        email: "John.Doe@example.com",
        password: "HelloWorld1!"
    });
});

describe("API route for Sign In (correct credentials)", () => {
    it("Should return OK for correct sign in", async () => {
        const req = new Request("http:localhost/api/users", {
            method: "POST",
            body: JSON.stringify({
                email: "john.doe@example.com",
                password: "HelloWorld1!"
            }),
            headers: { "Content-Type": "application/json" }
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.token).toBeTruthy();
    });
});

describe("API route for Sign In (incorrect credentials)", () => {
    it("Should return 401 with incorrect email", async () => {
        const req = new Request("http:localhost/api/users", {
            method: "POST",
            body: JSON.stringify({
                email: "Jon.Doe@example.com",
                password: "HelloWorld1"
            }),
            headers: { "Content-Type": "application/json" }
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(401);
        expect(json.token).toBeFalsy();
        expect(json.error).toBe("User not found");
    });

    it("Should return 401 with incorrect password", async () => {
        const req = new Request("http:localhost/api/users", {
            method: "POST",
            body: JSON.stringify({
                email: "john.doe@example.com",
                password: "HelloWorld1"
            }),
            headers: { "Content-Type": "application/json" }
        });
    
        const res = await POST(req);
        const json = await res.json();
    
        expect(res.status).toBe(401);
        expect(json.token).toBeFalsy();
        expect(json.error).toBe("Incorrect Password");
    });
});