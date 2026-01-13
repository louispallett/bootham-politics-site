import { connectToDB } from "@/lib/db";
import HttpError from "@/lib/HttpError";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const PutValidation = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name must not be more than 50 charcters" }),
  lastName: z
    .string()
    .trim()
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name must not be more than 50 charcters" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .max(100, { message: "Email name must not be more than 100 charcters" }),
});

export async function PUT(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  try {
    if (!token) {
      throw new HttpError("No token provided", 403);
    }

    await connectToDB();

    const decoded = jwt.verify(token, process.env.JWT_SECRET!, {
      algorithms: ["HS256"],
    }) as { userId: string };
    const userId = decoded.userId;

    const body = await req.json();

    const parsed = PutValidation.safeParse(body);
    if (!parsed.success)
      throw new HttpError(parsed.error.issues[0].message, 400);
    const { firstName, lastName, email } = parsed.data;

    const user = await User.findById(userId);
    if (!user) throw new HttpError("User not found", 404);

    await User.updateOne(
      { _id: userId },
      {
        firstName: firstName,
        lastName: lastName,
        email: email,
      },
    );

    return new NextResponse(null, { status: 204 });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: err.statusCode || 500 },
    );
  }
}
