
import React from "react";
import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import FriendRemoveList from "@/components/FriendRemoveList";


const FriendsPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();


  const friends = await getFriendsByUserId(session.user.id);

  return (
    <div className="flex flex-col items-center p-8">
      <FriendRemoveList sessionId={session.user.id} friendsList={friends}/>
    </div>
  );
};

export default FriendsPage;
