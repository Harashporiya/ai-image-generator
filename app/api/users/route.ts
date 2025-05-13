import { userTable } from "@/src/db/schema";
import { db } from "@/src/index";
import { NextResponse } from "next/server";
import { userSchema } from "@/src/lib/validations/userSchema";
import bcrypt from "bcryptjs";


export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = userSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = await db
      .insert(userTable)
      .values({ name, email, password:hashedPassword })
      .returning();

      return NextResponse.json(
        {
          message: "User created successfully!",
          user: createUser,
        },
        { status: 201 }
      );
  } catch (error) {
    console.error("User creation error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


