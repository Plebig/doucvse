"use client";

import { pusherClient } from "@/lib/pusher";
import { chatHrefConstructor, toPusherKey } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/legacy/image";
import { set } from "date-fns";

interface SidebarChatListProps {
  friends: User[];
  sessionId: string;
}

interface ExtendedMessage extends Message {
  senderImg: string;
  senderName: string;
}

const SidebarChatList = ({ friends, sessionId }: SidebarChatListProps) => {
  const pathName = usePathname();
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const [unseenMessagesCount, setUnseenMessagesCount] = useState<{[friendId: string] : number}>({});
  const [activeChats, setActiveChats] = useState<User[]>(friends);
  const [lastMessages, setLastMessages] = useState<{
    [key: string]: { text: string; timeStamp: number };
  }>({});

  useEffect(() => {
    const fetchLastMessages = async () => {
      const messages: { [key: string]: { text: string; timeStamp: number } } =
        {};
      for (const friend of friends) {
        const response = await fetch(`/api/get-last-message`, {
          method: "POST",
          body: JSON.stringify({ sessionId, friendId: friend.id }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        messages[friend.id] = data.lastMessage;
      }
      setLastMessages(messages);
    };
    fetchLastMessages();

    const getUnseendCount = async () => {
      const response = await fetch(`/api/get-unseen-count`, {
        method: "POST",
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setUnseenMessagesCount(data);
    }
    getUnseendCount();

    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const newFriendHandler = (newFriend: User) => {
      if(activeChats.some((friend) => friend.id === newFriend.id)){
        return;
      };
      setActiveChats((prev) => [...prev, newFriend]);
    };

    const chatHandler = (message: ExtendedMessage) => {
      setLastMessages((prevLastMessages) => ({
        ...prevLastMessages, // Keep all existing entries
        [message.senderId]: {
          text: message.type === "offer" ? "nabídka konzultace" : message.text, // Update the text
          timeStamp: message.timeStamp, // Update the timestamp
        },
        
      }));

      setUnseenMessagesCount((prev) => ({
        ...prev,
        [message.senderId]: (prev[message.senderId] || 0 )+ 1,
      }));
      const shouldNotify =
        pathName !==
        `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`;

      if (!shouldNotify) return;
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
      {activeChats
        .sort((a, b) => {
          const timeStampA = lastMessages[a.id]?.timeStamp || 0; // Default to 0 if undefined
          const timeStampB = lastMessages[b.id]?.timeStamp || 0; // Default to 0 if undefined
          return timeStampB - timeStampA; // Sort in descending order (most recent first)
        })
        .map((friend) => {
          const unseenCount = unseenMessagesCount[friend.id] !== undefined ? unseenMessagesCount[friend.id] : 0;

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
                  <p className="text-gray-500 max-w-[200px] truncate">
                    {lastMessages[friend.id]?.text}
                  </p>
                </div>
                {unseenCount > 0 ? (
                  <div className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">
                    {unseenCount}
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
