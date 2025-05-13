import { db } from "@/src/index";
import { userTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { loginSchema } from "@/src/lib/validations/loginSchema";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const existingUsers = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email));

    const user = existingUsers[0];
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

   
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({
      message: "Login successful",
      user: existingUsers,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}