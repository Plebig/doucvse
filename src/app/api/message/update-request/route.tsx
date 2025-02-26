import { fetchRedis } from "@/helpers/redis";
import { chatHrefConstructor, toPusherKey } from "@/lib/utils";
import { db } from "@/lib/dbR";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  try {
    const { id, teacherId, studentId } = await req.json();

    if (!id || !teacherId || !studentId) {
      return new Response("Missing data", { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const messages = await fetchRedis(
      "zrange",
      `chat:${chatHrefConstructor(teacherId, studentId)}:messages`,
      0,
      -1
    );
    const request = messages.find(
      (msg: string) => JSON.parse(msg).id === id
    );

    if (request) {
      const parsedRequest = JSON.parse(request);
      parsedRequest.isPaid = true;

      await db.zrem(
        `chat:${chatHrefConstructor(teacherId, studentId)}:messages`,
        request
      );
      await db.zadd(
        `chat:${chatHrefConstructor(teacherId, studentId)}:messages`,
        {
          score: parsedRequest.timeStamp,
          member: JSON.stringify(parsedRequest),
        }
      );
      await pusherServer.trigger(
        toPusherKey(`requestAccepted:${parsedRequest.id}`),
        "request-accepted",
          parsedRequest
      );

    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("error", error);
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    return new Response("internal server error", { status: 500 });
  }
}
