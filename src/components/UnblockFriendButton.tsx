"use client";
import { useRouter } from "next/router";
import React from "react";

interface Props {
  friendId: string;
}

const UnblockFriendButton = ({ friendId }: Props) => {
  async function removeFriend(friendId: string) {
    await fetch("/api/friends/unblock", {
      method: "POST",
      body: JSON.stringify({ id: friendId }),
    });
  }



  return (
    <>
      <button
        onClick={() => {
          removeFriend(friendId);
        }}
      >
        unblock
      </button>
    </>
  );
};

export default UnblockFriendButton;
