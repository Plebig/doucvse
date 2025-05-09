import { fetchRedis } from "@/helpers/redis";
import { db } from "@/lib/dbR";
import { getServerSession } from "next-auth";
import { nanoid } from "nanoid";
import { Offer, offerValidator } from "@/lib/validations/message";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const {
      chatId,
      teacherId,
      type,
      date,
      timeSlot,
      sessionLength,
      hourlyCost,
      subject
    }: {
      chatId: string;
      teacherId: string;
      type: string;
      date: number;
      timeSlot: string;
      sessionLength: number;
      hourlyCost: number;
      subject: string;
    } = await req.json();

    if (!chatId || !teacherId || !type || !date || !timeSlot || !sessionLength) {
      return new Response("Missing data", { status: 400 });
    }

    let hourlyCostDefault = -1;
    if (!hourlyCost) {
      const response = await fetchRedis("get", `user:${teacherId}:information`);
      const responseData = JSON.parse(response);
      hourlyCostDefault = parseInt(responseData.price, 10);
    }
    else {
      hourlyCostDefault = parseInt(hourlyCost.toString(), 10);
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const [userId1, userId2] = chatId.split("--");

    if (session.user.id !== userId1 && session.user.id !== userId2) {
      return new Response("Unauthorized", { status: 401 });
    }

    const friendId = session.user.id === userId1 ? userId2 : userId1;
    const studentId = teacherId === userId1 ? userId2 : userId1;
    const rawSender = (await fetchRedis(
      "get",
      `user:${session.user.id}`
    )) as string;
    const sender = JSON.parse(rawSender) as User;

    const timestamp = Date.now();

    const offerData: Offer = {
      id: nanoid(),
      senderId: session.user.id,
      teacherId: teacherId,
      studentId: studentId,
      date: date,
      timeSlot: timeSlot,
      sessionLength: sessionLength,
      hourlyCost: hourlyCostDefault,
      timeStamp: timestamp,
      subject: subject,
      type: type,
      isPaid: false,
    };

    const message = offerValidator.parse(offerData);

    //notify all connected clients

    await pusherServer.trigger(
      toPusherKey(`chat:${chatId}`),
      "incoming-message",
      message
    );

    await pusherServer.trigger(toPusherKey(`user:${friendId}:chats`), "new_message", {
      ...message,
      senderImg: sender.image,
      senderName: sender.name,
    });

    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    });

    return new Response("OK");
  } catch (error) {
    console.error("error", error);
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    return new Response("internal server error", { status: 500 });
  }
}
