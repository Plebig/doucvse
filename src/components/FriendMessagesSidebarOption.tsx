"use client";
import { pusherClient } from "@/lib/pusher";
import { chatHrefConstructor, toPusherKey } from "@/lib/utils";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import { Send } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import UnseenChatToast from "./UnseenChatToast";
import { usePathname } from "next/navigation";

interface Props {
  sessionId: string;
}

interface ExtendedMessage extends Message {
  senderImg: string;
  senderName: string;
}

const FriendMessagesSidebarOption = ({ sessionId }: Props) => {
  // zobrazit pocet nezpracovanych zprav
  // toast notifikace
  // remove friend aby se odecetlat neprectana zprava
  const [unseenMessagesCount, setUnseenMessagesCount] = useState<number>(0);
  const [unseenUserMessages, setUnseenUserMessages] = useState<string[]>([]);
  const pathName = usePathname();

  useEffect(() => {
    const getUnseenCount = async () => {
      const response = await fetch(`/api/get-unseen-count`, {
        method: "POST",
        body: JSON.stringify({ sessionId }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("data", data);
      setUnseenMessagesCount(Object.keys(data).length);
    };
    getUnseenCount();
  });

  useEffect(() => {
    
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));

    const notifyUser = (message: ExtendedMessage) => {
      const shouldNotify =
        pathName !==
        `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`;

      if (!shouldNotify) return;

      //should be notified
      setUnseenUserMessages((prevUnseenUserMessages) => {
        if (!prevUnseenUserMessages.includes(message.senderId)) {
          // Increment unseenMessagesCount only if adding a new sender
          setUnseenMessagesCount((prevCount) => prevCount + 1);
          return [...prevUnseenUserMessages, message.senderId];
        }
        return prevUnseenUserMessages; // No change if senderId already exists
      });
      let text = "";
      if (message.type === "offer") {
        text = "Nabídka konzultace";
      } else {
        text = message.text;
      }
      console.log("text", text);
      toast.custom((t) => (
        //custom component
        <UnseenChatToast
          t={t}
          sessionId={sessionId}
          senderId={message.senderId}
          senderImg={message.senderImg}
          senderName={message.senderName}
          senderMessage={text}
        />
      ));
    };

    pusherClient.bind("new_message", notifyUser);
    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
      pusherClient.unbind("new_message", notifyUser);
    };
  }, [pathName, sessionId]);

  return (
    <div>
      <Link
        href="/dashboard/messages"
        className="text-gray-700 hover:text-[#0072FA] hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 leading-6 font-semibold text-lg"
      >
        <div className="w-8 h-8 flex items-center justify-center">
          <Image
            src="/img/Sidebar/chat.svg"
            alt="chat"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </div>
        <p className="truncate">Zprávy</p>
        {unseenMessagesCount > 0 ? (
          <div className="rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600 ">
            {unseenMessagesCount}
          </div>
        ) : null}
      </Link>
    </div>
  );
};

export default FriendMessagesSidebarOption;
