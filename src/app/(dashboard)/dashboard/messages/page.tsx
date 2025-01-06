
import React from 'react'
import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import SidebarChatList from '@/components/SidebarChatList';

const MessagesPage = async () => {

  const session = await getServerSession(authOptions);
  if (!session) {
    notFound();
  }

  const friends = await getFriendsByUserId(session.user.id);

  return (
    <div className=''>
      <h1 className='text-3xl font-bold'>Messages</h1>
      <SidebarChatList friends={friends} sessionId={session.user.id} />
    </div>
  )
}

export default MessagesPage
