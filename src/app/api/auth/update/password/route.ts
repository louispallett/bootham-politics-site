import { connectToDB } from "@/lib/db";
import HttpError from "@/lib/HttpError";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const PutValidation = z.object({
    currentPassword: z.string().trim().min(1).max(50),
    newPassword: z
      .string()
      .trim()
      .min(8)
      .max(200)
      .refine(
        (val: string) =>
          /[A-Z]/.test(val) &&
          /[a-z]/.test(val) &&
          /[0-9]/.test(val) &&
          /[^A-Za-z0-9]/.test(val),
        {
          message: "Password must include upper/lowercase, number, and symbol",
        },
      ),
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

    const parsed = PutValidation.safeParse({ data: body.data });
    if (!parsed.success) throw new HttpError(parsed.error.message, 400);
    const { currentPassword, newPassword } = parsed.data;

    const user = await User.findById(userId);
    if (!user) throw new HttpError("User not found", 400);

    const correctPassword = await bcrypt.compare(
      currentPassword,
      newPassword,
    );

    if (!correctPassword) {
      throw new HttpError("Incorrect Current Password", 401);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await User.updateOne({ _id: userId }, { password: hashedPassword });

    return new NextResponse(null, { status: 204 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: err.statusCode || 500 },
    );
  }
}
