"use client";

import React from 'react'
import Button from './ui/Button'
import { useRouter } from 'next/navigation';



interface Props {
  senderId: string 
}

const InChatAccept = ({senderId}: Props) => {
  const router = useRouter()

  const acceptFriend = async (senderId: string) => {
    await fetch('/api/friends/accept', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: senderId }),
    });
  
    router.refresh()
  }
  
  const denyFriend = async (senderId: string) => {
    await fetch('/api/friends/deny', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: senderId }),
    });
    router.push('/dashboard/requests')
    router.refresh()
  }
  

  return (
    <div>
      <Button onClick={() => {acceptFriend(senderId)}}>Prijmout</Button>
      <Button onClick={() => {denyFriend(senderId)}}>Odmítnout</Button>
    </div>
  )
}

export default InChatAccept
