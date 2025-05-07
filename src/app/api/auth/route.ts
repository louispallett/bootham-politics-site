import { connectToDB } from "@/lib/db";
import { NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Sign in
export async function POST(req:Request) {
    try {
        await connectToDB();
        const data = await req.json();
        const user = await User.findOne({ email: data.email.toLowerCase() });
        
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 401 });
        }

        const correctPassword = await bcrypt.compare(data.password, user.password);
        if (!correctPassword) {
            return NextResponse.json({ message: "Incorrect Password" }, { status: 401 });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: "36h" }
        );

        return NextResponse.json({ token }, { status: 200 });
    } catch (err:any) {
        console.error("Login error: ", err);
        return NextResponse.json(
            { success: false, message: err.message || "Internal Server Error" },
            { status: err.statusCode || 500 }
        );
    }
}