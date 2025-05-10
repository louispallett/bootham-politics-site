import { NextResponse } from "next/server";

export default async function POST() {
  const response = NextResponse.json({ message: "Logged out" }, { status: 200 });

  response.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  return response;
}
  