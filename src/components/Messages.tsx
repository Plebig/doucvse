"use client";
import { cn, toPusherKey } from "@/lib/utils";
import { ChatMessage } from "@/lib/validations/message";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { pusherClient } from "@/lib/pusher";
import InChatOffer from "./InChatOffer";
import Link from "next/link";

interface MessageProps {
  initialMessages: ChatMessage[];
  sessionId: string;
  chatId: string;
  sessionImg: string | null | undefined;
  chatPartner: User;
}

const Messages = ({
  initialMessages,
  sessionId,
  chatId,
  sessionImg,
  chatPartner,
}: MessageProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`chat:${chatId}`));

    const messageHandler = (message: ChatMessage) => {
      setMessages((prev) => [message, ...prev]);
    };

    pusherClient.bind("incoming-message", messageHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));
      pusherClient.unbind("incoming-message", messageHandler);
    };
  }, [chatId]);

  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  const isMessage = (message: ChatMessage) => {
    return message.type === "text";
  };

  const formaTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);

    // Format parts
    const day = String(date.getDate()).padStart(2, "0"); // Day with leading zero
    const month = date.toLocaleString("cs-CZ", { month: "short" }); // Short month name
    const year = date.getFullYear(); // Full year
    const hours = String(date.getHours()).padStart(2, "0"); // Hours with leading zero
    const minutes = String(date.getMinutes()).padStart(2, "0"); // Minutes with leading zero

    // Combine into desired format
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  };

  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollDownRef} />
      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === sessionId;

        const hasNextMessageFromSameUser =
          messages[index - 1]?.senderId === messages[index].senderId;
        return (
          <div key={index}>
            {isMessage(message) ? (
              <div
                className="chat-message"
                key={`${message.id}-${message.timeStamp}`}
              >
                <div
                  className={cn("flex items-end", {
                    "justify-end": isCurrentUser,
                  })}
                >
                  <div
                    className={cn(
                      "flex flex-col space-y-2 text-base max-w-xs mx-2",
                      {
                        "order-1 items-end": isCurrentUser,
                        "order-2": !isCurrentUser,
                      }
                    )}
                  >
                    <span
                      className={cn("px-4 py-2 rounded-lg inline-block", {
                        "bg-indigo-600 text-white": isCurrentUser,
                        "bg-gray-200 text-gray-900": !isCurrentUser,
                        "rounded-br-none":
                          !hasNextMessageFromSameUser && isCurrentUser,
                        "rounded-bl-none":
                          !hasNextMessageFromSameUser && !isCurrentUser,
                      })}
                    >
                      {"text" in message ? message.text : ""}{" "}
                      <span className="ml-2 text-xs text-gray-400">
                        {formaTimestamp(message.timeStamp)}
                      </span>
                    </span>
                  </div>
                  <div
                    className={cn("relative w-6 h-6", {
                      "order-2": isCurrentUser,
                      "order-1": !isCurrentUser,
                      invisible: hasNextMessageFromSameUser,
                    })}
                  >
                    {chatPartner.role === "teacher" && !isCurrentUser ? (
                      <Link
                        href={`/dashboard/teacherProfile/${chatPartner.id}`}
                      >
                        <Image
                          fill
                          src={
                            isCurrentUser
                              ? (sessionImg as string)
                              : chatPartner.image
                          }
                          alt="profile picture"
                          referrerPolicy="no-referrer"
                        />
                      </Link>
                    ) : (
                      <Image
                        fill
                        src={
                          isCurrentUser
                            ? (sessionImg as string)
                            : chatPartner.image
                        }
                        alt="profile picture"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <InChatOffer
                hasNextMessageFromSameUser={hasNextMessageFromSameUser}
                isCurrentUser={isCurrentUser}
                message={message}
              ></InChatOffer>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
