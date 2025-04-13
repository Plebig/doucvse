import Messages from "@/components/Messages";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { chatMessageValidator } from "@/lib/validations/message";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import { Info } from "lucide-react";
import RemoveFriendButton from "@/components/RemoveFriendButton";
import UnblockFriendButton from "@/components/UnblockFriendButton";
import ChatDownSection from "@/components/ui/ChatDownSection";
import CreateOffer from "@/components/CreateOffer";
import Link from "next/link";

interface PageProps {
  params: {
    chatId: string;
  };
}

async function getChatMessages(chatId: string) {
  try {
    // Fetch messages from Redis
    const results: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1
    );

    // Parse each message as either `Message` or `Offer`
    const dbMessages = results.map((message) => {
      try {
        return chatMessageValidator.parse(JSON.parse(message));
      } catch (error) {
        console.error("Invalid message format:", error);
        throw error; // Rethrow or handle invalid message as needed
      }
    });

    // Reverse messages for correct order
    const reversedDbMessages = dbMessages.reverse();

    // Validate the array of messages
    //const messages = messageArrayValidator.parse(reversedDbMessages);

    return reversedDbMessages;
  } catch (error) {
    console.error("Failed to fetch or parse messages:", error);
    notFound();
  }
}

const ChatPage = async ({ params }: PageProps) => {
  const { chatId } = params;
  const session = await getServerSession(authOptions);
  if (!session) {
    notFound();
  }

  const { user } = session;
  const [userId1, userId2] = chatId.split("--");

  if (user.id !== userId1 && user.id !== userId2) {
    notFound();
  }

  const chatPartnerId = user.id === userId1 ? userId2 : userId1;

  const chatPartnerRaw = (await fetchRedis(
    "get",
    `user:${chatPartnerId}`
  )) as string;
  const chatPartner = JSON.parse(chatPartnerRaw) as User;

  const initialMessages = await getChatMessages(chatId);

  const friendList = (await fetchRedis(
    "smembers",
    `user:${session.user.id}:friends`
  )) as string[];
  const isFriend = friendList.includes(chatPartnerId);

  const myFriendRequests = (await fetchRedis(
    "smembers",
    `user:${session.user.id}:incoming_friend_requests`
  )) as string[];

  let iHaveThisRequest = false;

  if (myFriendRequests.includes(chatPartnerId)) {
    iHaveThisRequest = true;
  } else {
    iHaveThisRequest = false;
  }

  const blockedBy = (await fetchRedis(
    "smembers",
    `user:${session.user.id}:blockedBy`
  )) as string[];

  const amIblocked = blockedBy.includes(chatPartnerId);

  const blockedFriends = (await fetchRedis(
    "smembers",
    `user:${session.user.id}:blockedFriends`
  )) as string[];

  const amIblocking = blockedFriends.includes(chatPartnerId);
  const amIteacher = session.user.role === "teacher";

  return (
    <div className="flex-1 justify-between flex h-full max-h-[calc(100vh-6rem)]">
      <div className="flex-1 justify-between flex flex-col h-full">
        <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
          <div className="relative flex items-center space-x-4">
            <div className="relative">
              <div className="relative w-8 sm:w-12 h-8 sm:h-12">
                {chatPartner.role === "teacher" ? (
                  <Link href={`/dashboard/teacherProfile/${chatPartnerId}`}>
                    <Image
                      fill
                      referrerPolicy="no-referrer"
                      src={chatPartner.image}
                      alt={`${chatPartner.name} profile picture`}
                      className="rounded-full"
                    />
                  </Link>
                ) : (
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    src={chatPartner.image}
                    alt={`${chatPartner.name} profile picture`}
                    className="rounded-full"
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col leading-tight">
              <div className="text-xl flex items-center">
                <span className="text-gray-700 mr-3 font-semibold">
                  {chatPartner.role === "teacher" ? (
                    <Link href={`/dashboard/teacherProfile/${chatPartnerId}`}>
                      {chatPartner.name}
                    </Link>
                  ) : (
                    <div>{chatPartner.name}</div>
                  )}
                </span>
              </div>
              {chatPartner.role === "teacher" ? (
                <Link href={`/dashboard/teacherProfile/${chatPartnerId}`}>
                  <span className="text-sm text-gray-600">
                    {chatPartner.email}
                  </span>
                </Link>
              ) : (
                <span className="text-sm text-gray-600">
                  {chatPartner.email}
                </span>
              )}
            </div>
          </div>
          <div>
            <button>
              <Info />
            </button>
          </div>
        </div>

        <Messages
          sessionId={session.user.id}
          initialMessages={initialMessages}
          chatId={chatId}
          sessionImg={session.user.image}
          chatPartner={chatPartner}
        />
        <ChatDownSection
          sessionId={session.user.id}
          amIblockedProp={amIblocked}
          amIblockingProp={amIblocking}
          chatId={chatId}
          chatPartner={chatPartner}
          iHaveThisRequest={iHaveThisRequest}
          isFriend={isFriend}
        />
      </div>
      <div className="flex flex-col max-w-sm min-w-56 py-3 border-l-2 min-h-screen">
        <RemoveFriendButton friendId={chatPartnerId} />
        <UnblockFriendButton friendId={chatPartnerId} />
        {amIteacher ? (
          <CreateOffer
            sessionId={session.user.id}
            partnerId={chatPartnerId}
            isAuth={true}
            amIteacher={amIteacher}
          />
        ) : null}
      </div>
    </div>
  );
};

export default ChatPage;
