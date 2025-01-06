import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/dbR";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id: friendId } = z.object({ id: z.string() }).parse(body);

    const [userRaw, friendRaw] = (await Promise.all([
      fetchRedis("get", `user:${session.user.id}`),
      fetchRedis("get", `user:${friendId}`),
    ])) as [string, string];

    const user = JSON.parse(userRaw) as User;
    const friend = JSON.parse(friendRaw) as User;
    console.log("user: " + user + " id: " + user.id);
    console.log("friend: " + friend + " id: " + friend.id);
    await Promise.all([
      pusherServer.trigger(
        toPusherKey(`user:${friendId}:removeFriend`),
        "remove_friend",
        friend
      ),
      pusherServer.trigger(
        toPusherKey(`user:${session.user.id}:removeFriend`),
        "remove_friend",
        friend
      ),
    ]);

    await db.sadd(`user:${session.user.id}:blockedFriends`, friendId);
    await db.sadd(`user:${friendId}:blockedBy`, session.user.id);

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }
    return new Response("Invalid request", { status: 400 });
  }
}
