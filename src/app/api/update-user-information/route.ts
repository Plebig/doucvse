import { db } from "@/lib/dbR";
import { hash, compare } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { fetchRedis } from "@/helpers/redis"; // Adjust the import as necessary

export async function POST(req: NextRequest) {

  try {
    const body = await req.json();
    console.log("bodydata" + JSON.stringify(body)); 
    const { userId, newEmail, newName, newPassword, currentPassword } = body;
    let password;
    let name;

    // Fetch the user data from the database
    const userRaw = await fetchRedis("get", `user:${userId}`);
    const user = JSON.parse(userRaw);
    const oldEmail = user.email;
    if (newEmail !== oldEmail) {
        db.del(`user:email:${oldEmail}`);
        db.set(`user:email:${newEmail}`, userId);
      }
  
    // Validate the current password
    
    const isPasswordValid = await compare(currentPassword, user.password);
    if (!isPasswordValid) {
      console.log("password not validated");
      console.log("password not validated" + currentPassword + user.password);
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 });
    }


    if(newPassword){
      password = await hash(newPassword, 12);;
    }
    else{
      password = user.password;
    }

    if(newName){
      name = newName;
    }
    else{
      name = user.name;
    }

    console.log("password" + password);
    const updatedUser = {
      ...user,
      email: newEmail,
      name: name,
      password: password,
    };
    console.log("updatedUser" + updatedUser);
    // Save the updated user data to the database
    await db.set(`user:${userId}`, updatedUser);
    console.log("user updated");
    return new Response("User information updated successfully!", { status: 200 });
  } catch (error) {
    console.log("error" + error);
    return new Response("An error occurred. Please try again.", { status: 400 });
  }

}