"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import RemoveFriendButton from "./RemoveFriendButton";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";



interface Props {
  sessionId: string;
  friendsList: User[];
}

const FriendRemoveList = ({sessionId, friendsList}: Props) => {
  const [friends, setFriends] = useState<User[]>(friendsList);
  useEffect(() => {
    setFriends(friends);
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:removeFriend`));

    const removeFriendHandler = (removedFriend: User) => {
      setFriends((prev) => prev.filter((friend) => friend.id !== removedFriend.id));
    }

    pusherClient.bind("remove_friend", removeFriendHandler);
    return () => {
      pusherClient.unbind("remove_friend", removeFriendHandler);
    }
  }, [sessionId]);

  return (
    <div className="flex flex-col items-center p-8">
      {friends.map((friend) => {
        return (
          <div
            key={friend.id}
            className="flex items-center justify-between w-[400px]"
          >
            <div className="flex items-center">
              <div className="relative w-14 h-14">
                <Image
                  fill
                  referrerPolicy="no-referrer"
                  src={friend.image}
                  alt={friend.name}
                  className="rounded-full"
                />
              </div>

              <div className="ml-2">
                <p className="font-semibold text-slate-800 text-xl">
                  {friend.name}
                </p>
                <p className=" text-gray-400 text-md">{friend.email}</p>
              </div>
            </div>
            <RemoveFriendButton friendId={friend.id} />
          </div>
        );
      })}
    </div>
  );
};

export default FriendRemoveList;
