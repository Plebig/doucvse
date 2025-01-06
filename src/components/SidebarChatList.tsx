"use client";

import { pusherClient } from "@/lib/pusher";
import { chatHrefConstructor, toPusherKey } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UnseenChatToast from "./UnseenChatToast";
import Image from "next/legacy/image";
import { getLastMessage } from "@/helpers/get-last-message";

interface SidebarChatListProps {
  friends: User[];
  sessionId: string;
}

interface ExtendedMessage extends Message {
  senderImg: string;
  senderName: string;
}

const SidebarChatList = ({ friends, sessionId }: SidebarChatListProps) => {
  const router = useRouter();
  const pathName = usePathname();
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const [activeChats, setActiveChats] = useState<User[]>(friends);
  const [lastMessages, setLastMessages] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {

    const fetchLastMessages = async () => {
      const messages: { [key: string]: string } = {};
      for (const friend of friends) {
        const response = await fetch(
          `/api/get-last-message`,
          { method: "POST",
            body: JSON.stringify({ sessionId, friendId: friend.id }),
          }
        );
        
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        messages[friend.id] = data.lastMessage;
      }
      setLastMessages(messages);
    };

    fetchLastMessages();

    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const newFriendHandler = (newFriend: User) => {
      setActiveChats((prev) => [...prev, newFriend]);
    };

    const chatHandler = (message: ExtendedMessage) => {
      let updatedLastMessages = {};
      if(message.type === "offer") {
        updatedLastMessages = { ...lastMessages, [message.senderId]: "nabídka konzultace" };  
        console.log("updated last messages: ", updatedLastMessages);
      }
      else {
        updatedLastMessages = { ...lastMessages, [message.senderId]: message.text };
      }
      setLastMessages(updatedLastMessages);
      console.log("lastMessages: ", lastMessages);  
      console.log("senderId: ", message.senderId + " text: ", message.text + " lastMessages: ", lastMessages[message.senderId]);
      const shouldNotify =
        pathName !==
        `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`;

      if (!shouldNotify) return;

      //should be notified

      //toast.custom((t) => (
      //  //custom component
      //  <UnseenChatToast
      //    t={t}
      //    sessionId={sessionId}
      //    senderId={message.senderId}
      //    senderImg={message.senderImg}
      //    senderName={message.senderName}
      //    senderMessage={message.text}
      //  />
      //));
      setUnseenMessages((prev) => [...prev, message]);
    };

    pusherClient.bind("new_message", chatHandler);
    pusherClient.bind("new_friend", newFriendHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));

      pusherClient.unbind("new_message", chatHandler);
      pusherClient.unbind("new_friend", newFriendHandler);
    };
  }, [pathName, sessionId]);

  useEffect(() => {
    if (pathName?.includes("chat")) {
      setUnseenMessages((prev) => {
        return prev.filter((msg) => !pathName.includes(msg.senderId));
      });
    }
  }, [pathName]);

  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
      {activeChats.sort().map((friend) => {
        console.log("activated chats: " + lastMessages[friend.id]);
        const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
          return unseenMsg.senderId === friend.id;
        }).length;

        return (
          <li key={friend.id}>
            <a
              className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-mf p-2 text-sm leading-6 font-semibold"
              href={`/dashboard/chat/${chatHrefConstructor(
                sessionId,
                friend.id
              )}`}
            >
              <div className="relative w-4 h-4 sm:w-8 sm:h-8">
                <Image
                  src={friend.image}
                  alt={friend.name}
                  layout="fill"
                  className="rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <p>{friend.name}</p>
                <p className="text-gray-500 max-w-[200px] truncate">{lastMessages[friend.id]}</p>
              </div>
              {unseenMessagesCount > 0 ? (
                <div className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">
                  {unseenMessagesCount}
                </div>
              ) : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarChatList;
