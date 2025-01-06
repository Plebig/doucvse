"use client";
import React from 'react'

interface Props {
  friendId: string  
}

const RemoveFriendButton = async ({friendId}: Props) => {
  
  async function removeFriend(friendId: string) { 
    await fetch('/api/friends/remove', {
      method: 'POST',
      body: JSON.stringify({ id: friendId }),})
  }

  return (
    <>
      <button onClick={() => {removeFriend(friendId)}}>block</button>
    </>
  )
}

export default RemoveFriendButton
