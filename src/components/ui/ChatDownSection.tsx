"use client";
import React, { useEffect, useState } from "react";
import ChatInput from "@/components/ChatInput";
import InChatAccept from "@/components/InChatAccept";
import UnblockFriendButton from "@/components/UnblockFriendButton";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

interface Props {
  sessionId: string;
  chatPartner: User;
  isFriend: boolean;
  iHaveThisRequest: boolean;
  amIblockedProp: boolean;
  amIblockingProp: boolean;
  chatId: string; 
}

const ChatDownSection = ({chatPartner, isFriend, amIblockedProp, amIblockingProp, chatId, iHaveThisRequest, sessionId}: Props) => {

  const [amIblocked, setAmIblocked] = useState(amIblockedProp);
  const [amIblocking, setAmIblocking] = useState(amIblockingProp);

  useEffect(() => {


    pusherClient.subscribe(toPusherKey(`user:${sessionId}:removeFriend`));
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:unBlockFriend`));
    const removeFriendHandler = (removedFriend: User) => {
      if (removedFriend.id === chatPartner.id) {
        console.log("removed friend" + removedFriend.id);
        setAmIblocked(false);
        setAmIblocking(true);
      }
      else if (removedFriend.id === sessionId) {
        console.log("removed friend" + removedFriend.id);
        setAmIblocked(true);
        setAmIblocking(false);
      }
    }

    const unBlockFriendHandler = (unBlockedFriend: User) => {
        setAmIblocked(false);
        setAmIblocking(false);
    }

    pusherClient.bind("remove_friend", removeFriendHandler);
    pusherClient.bind("unBlock_friend", unBlockFriendHandler);
    return () => {
      pusherClient.unbind("remove_friend", removeFriendHandler);
      pusherClient.unbind("unBlock_friend", unBlockFriendHandler);
    }
  }, [sessionId]);


  return (
    <div>
      {isFriend && !amIblocked && !amIblocking ? (
        <ChatInput chatId={chatId} chatPartner={chatPartner} />
      ) : iHaveThisRequest ? (
        <InChatAccept senderId={chatPartner.id} />
      ) : !amIblocked && !amIblocking ? (
        <ChatInput chatId={chatId} chatPartner={chatPartner} />
      ) : amIblocking ? (
        //unblock button
        <div>
          <UnblockFriendButton friendId={chatPartner.id} />
          <p>you blocked this friend</p>
        </div>
      ) : (
        <p>blocked by</p>
      )}
    </div>
  );
};

export default ChatDownSection;
