import { connectToDB } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { z } from "zod";

const RegisterSchema = z.object({
    firstName: z.string().trim().min(1).max(50),
    lastName: z.string().trim().min(1).max(50),
    email: z.string().trim().email().max(100),
    password: z.string().trim().min(8).max(200).refine((val) =>
        /[A-Z]/.test(val) && /[a-z]/.test(val) && /[0-9]/.test(val) && /[^A-Za-z0-9]/.test(val),
        {
            message: "Password must include upper/lowercase, number, and symbol",
        }
    )
});

// Register
export async function POST(req:Request) {
    try {
        await connectToDB();
        const body = await req.json();

        const parsed = RegisterSchema.safeParse(body);
        if(!parsed.success) {
            return NextResponse.json({
                message: "Validation Errors",
                errors: parsed.error.flatten().fieldErrors,
            }, { status: 400 });
        }

        const { firstName, lastName, email, password } = parsed.data;

        const userExists = await User.findOne({ email: body.email.toLowerCase() });
        if (userExists) {
            return NextResponse.json({ message: "Email already used for another account" }, { status: 401 });
        }
        
        if (body.passkey != process.env.PASS_KEY) {
            return NextResponse.json({ message: "Invalid Pass Key" }, { status: 401 });
        }
        
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email.toLowerCase(),
            password: hashedPassword
        })

        return NextResponse.json({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }, { status: 201 });
    } catch (err:any) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: err.message || "Internal Server Error" },
            { status: err.statusCode || 500 }
        );
    }
}