import FriendRequestSidebarOption from "@/components/FriendRequestSidebarOption";
import { Icons } from "@/components/Icons";
import MobileChatLayout from "@/components/MobileChatLayout";
import { BookMarked, User, Send, CalendarClock } from "lucide-react";
import SignOutButton from "@/components/SignOutButton";
import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";
import { SideBarOption } from "@/types/typings";
import FriendMessagesSidebarOption from "@/components/FriendMessagesSidebarOption";
import Button from "@/components/ui/Button";

interface LayoutProps {
  children: ReactNode;
}

const sideBarOptions: SideBarOption[] = [
  {
    id: 1,
    name: "add friend",
    href: "/dashboard/add",
    Icon: "UserPlus",
  },
];

const layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions);
  if (session) {
    const friends = await getFriendsByUserId(session.user.id);
    const unseenRequestCount = (
      (await fetchRedis(
        "smembers",
        `user:${session.user.id}:incoming_friend_requests`
      )) as User[]
    ).length;

    return (  
      <div className="w-full flex h-screen">
        <div className="md:hidden">
          <MobileChatLayout
            friends={friends}
            session={session}
            sidebarOptions={sideBarOptions}
            unseenRequestCount={unseenRequestCount}
          />
        </div>
        <div className="hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 owerflow-y-autpo border-r border-gray-200 bg-white px-6">
          <Link href="/dashboard" className="flex h-16 shrin-0 items-center">
            <Icons.Logo className="h-8 w-auto text-indigo-600" />
          </Link>
          {friends.length > 0 ? (
            <div className="text-xs font-semibold leading-6 text-gray-400"></div>
          ) : null}

          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                {/*
                <SidebarChatList friends={friends} sessionId={session.user.id} />
                
                */}
              </li>
              <li>
                <div className="text-xs font-semibold leading-6 text-gray-400">
                  Overwiev
                </div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {sideBarOptions.map((option) => {
                    const Icon = Icons[option.Icon];
                    return (
                      <li key={option.id}>
                        <Link
                          href={option.href}
                          className="text-gray-700 hover:text-indigo-700 hover:bg-gray-50 group flex gap-3 rounded-md p-2 leading-6 font-semibold"
                        >
                          <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-large border-text-[0.625rem] font-medium">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="truncate">{option.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                  <li>
                    <FriendRequestSidebarOption
                      sessionId={session.user.id}
                      initialUnseenRequestCount={unseenRequestCount}
                    />
                  </li>
                  <li>
                    <FriendMessagesSidebarOption sessionId={session.user.id} />
                  </li>
                  <li>
                    <Link
                      href="/dashboard/findTeacher"
                      className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 leading-6 font-semibold"
                    >
                      <div className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                        <BookMarked className="h-4 w-4" />
                      </div>
                      <p className="truncate">Najít doučovatele</p>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/myLessons"
                      className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 leading-6 font-semibold"
                    >
                      <div className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                        <CalendarClock className="h-4 w-4" />
                      </div>
                      <p className="truncate">Moje doučování</p>
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="-mx-6 mt-auto flex items-center">
                <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
                  <div className="relative h-8 w-8 bg-gray-50">
                    <Link href="/dashboard/accountSettings/edit">
                      <Image
                        fill
                        referrerPolicy="no-referrer"
                        className="rounded-full"
                        src={session.user.image || ""}
                        alt="Your profile image"
                      />
                    </Link>
                  </div>
                  <span className="sr-only">Your profile</span>
                  <div className="flex flex-col">
                    <Link href="/dashboard/accountSettings/edit">
                      <span aria-hidden="true">{session.user.name}</span>
                    </Link>
                    <Link href="/dashboard/accountSettings/edit">
                      <span
                        className="text-xs text-zinc-400"
                        aria-hidden="true"
                      >
                        {session.user.email}
                      </span>
                    </Link>
                  </div>
                </div>
                <SignOutButton className="h-full aspect-square" />
              </li>
            </ul>
          </nav>
        </div>
        <aside className="max-h-screen w-full overflow-y-scroll">
          {children}
        </aside>
      </div>
    );
  } else {
    return (
      <div className="w-full flex h-screen">
        <div className="hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 owerflow-y-autpo border-r border-gray-200 bg-white px-6">
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li className="mt-8 flex items-center  w-full pb-4 gap-x-2">
                <Button variant="indigo">
                  <Link href="/login" className="">prihlasit Se</Link>
                </Button>
                <Button variant="ghost" className="border-2 border-indigo-600 hv:border-indigo-500 transition-all">
                  <Link href="/register" className="text-indigo-600">Registrovat se</Link>
                </Button>
              </li>
            </ul>
          </nav>
        </div>
        <aside className="max-h-screen w-full overflow-y-scroll">
          {children}
        </aside>
      </div>
    );
  }
};

export default layout;
