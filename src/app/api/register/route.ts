
import { NextRequest, NextResponse } from "next/server";
import { fetchRedis } from "@/helpers/redis";
import { db } from "@/lib/dbR";
import { hash } from "bcrypt";
import { customAlphabet } from "nanoid";

// Helper function to set Redis values
async function setRedis(key: string, value: any) {
  await db.set(key, JSON.stringify(value));
}

// Handle file upload and user registration
export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const name = data.get("name") as string;
    const surname = data.get("surname") as string;
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    const role = data.get("role") as string;

    if (!name || !email || !password || !role) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check if user already exists in Redis
    const userEmail = await fetchRedis("get", `user:email:${email}`);
    const alphabet =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const customNanoid = customAlphabet(alphabet, 21);

    if (userEmail === null) {
      // Create new user
      const hashedPass = await hash(password, 12);
      const userId = customNanoid();
      const filePath = "/profilePictures/image.png"
      
      // Save user data to Redis
      const newUser = {
        id: userId,
        name: name + " " + surname,
        email: email,
        password: hashedPass,
        role: role,
        image: filePath,
        faculty: "",
        major: "",
        year: "",
      };

      await setRedis(`user:${userId}`, newUser);
      await setRedis(`user:email:${email}`, newUser.id);

      const responseBody = JSON.stringify({ message: "OK", userId: userId });

      return new Response(responseBody, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return new Response("User already exists", { status: 409 });
    }
  } catch(error) {
    return new Response(`error při registraci ${error}`, { status: 400 });
  }
}
