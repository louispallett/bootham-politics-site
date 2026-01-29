import { connectToDB } from "@/lib/db";
import { NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const ValidationSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Email: Invalid email" })
    .min(1, { message: "Email: Required" })
    .max(100, { message: "Email: Max characters 100" }),
  password: z
    .string()
    .min(1, { message: "Passowrd: Required" })
    .max(200, { message: "Password: Max characters 200" }),
});

// Sign in
export async function POST(req: Request) {
  try {
    await connectToDB();
    const body = await req.json();

    const parsed = ValidationSchema.safeParse(body);
    if (!parsed.success) {
      console.error(parsed.error);
      return NextResponse.json(
        {
          message: "Validation Errors",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.error("User not found");
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      console.error("Incorrect Password");
      return NextResponse.json(
        { message: "Incorrect Password" },
        { status: 401 },
      );
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "36h",
    });

    const responseBody =
      process.env.NODE_ENV == "test" ? { token } : { success: true };
    const response = NextResponse.json(responseBody, { status: 200 });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 36,
    });

    return response;
  } catch (err: any) {
    console.error("Login error: ", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: err.statusCode || 500 },
    );
  }
}
