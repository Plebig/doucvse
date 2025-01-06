import FriendRequests from "@/components/FriendRequests";
import { getLastMessage } from "@/helpers/get-last-message";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

const RequestsPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    notFound();
  }

  const incomingSendersIds = (await fetchRedis(
    "smembers",
    `user:${session.user.id}:incoming_friend_requests`
  )) as string[];

  const incomingFriendRequests = await Promise.all(
    incomingSendersIds.map(async (senderId) => {
      const sender = (await fetchRedis("get", `user:${senderId}`)) as string;
      const lastMessage = (await getLastMessage(session.user.id, senderId)) as string;
      console.log("last message tsx", lastMessage)
      const senderParse = JSON.parse(sender);
      
      return {
        senderId,
        senderEmail: senderParse.email,
        senderImage: senderParse.image,
        lastMessage: lastMessage,
      };
    })
  );

  return (
    <main className="pt-8">
      <h1 className="font-bold text-5xl mb-8">Add a friend</h1>
      <div className="flex flex-col gap-4 ">
        <FriendRequests
          incomingFriendRequests={incomingFriendRequests}
          sessionId={session.user.id}
        />
      </div>
    </main>
  );
};

export default RequestsPage;
