import { fetchRedis } from "@/helpers/redis";
import { db } from "@/lib/dbR";

export async function POST(req: Request) {
  console.log("api update-user-profile-picture called");
  const body = await req.json();
  const url = body.url;
  const id = body.id;
  if(id == ""  ||id == null) 
    return new Response("Unauthorized", { status: 401 });
  const userDataRaw = await fetchRedis("get", `user:${id}`);
  const userData = JSON.parse(userDataRaw);
  userData.image = url;

  await db.set(`user:${id}`, userData);
  return new Response("OK");
}