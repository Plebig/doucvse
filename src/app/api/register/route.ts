import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
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
    const file: File | null = data.get("file") as unknown as File;
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    const role = data.get("role") as string;
    const faculty = data.get("faculty") as string;  

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

      let filePath = "/profilePictures/image.png";
      console.log("file", file);
      if (file) {
        if (file instanceof File) {
          console.log("file is instance of File");
          console.log("file type", file.type);
          console.log("file name", file.name);
          console.log("file type", file.type);
        }
        if (file.type !== "application/octet-stream") {
          // Handle file upload
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          // Define custom uploads directory path inside src/app/profilePictures
          let fileExtension = file.type.split("/")[1];
          if (fileExtension.includes("+")) {
            fileExtension = fileExtension.split("+")[0];
          }
          const uploadDir = path.join("public", "profilePictures");
          const saveDir = "/profilePictures";
          // Ensure the directory exists
          if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
          }

          // Create path for saving the uploaded file
          filePath = path.join(saveDir, `${userId}.${fileExtension}`);
          const filePathSave = path.join(
            uploadDir,
            `${userId}.${fileExtension}`
          );
          filePath = filePath.replace(/\\/g, "/");
          await writeFile(filePathSave, buffer);
        }
        else {
          filePath = "/profilePictures/image.png";
        }
      }
      // Save user data to Redis
      const newUser = {
        id: userId,
        name: name,
        email: email,
        password: hashedPass,
        role: role,
        faculty: faculty,
        image: filePath, // Storing the path to the uploaded profile picture
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
