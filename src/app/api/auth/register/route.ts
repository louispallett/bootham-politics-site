import { connectToDB } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";

// Register
export async function POST(req:Request) {
    try {
        await connectToDB();
        const data = await req.json();
        
        const hashedPassword = await bcrypt.hash(data.password, 12);

        const user = await User.create({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email.toLowerCase(),
            password: hashedPassword
        })

        return NextResponse.json({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }, { status: 201 });
    } catch (err:any) {
        console.error(err);
        return NextResponse.json({ err }, { status: 500 })
    }
}