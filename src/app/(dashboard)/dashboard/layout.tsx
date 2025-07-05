import FriendRequestSidebarOption from "@/components/FriendRequestSidebarOption";
import { Icons } from "@/components/Icons";
import MobileChatLayout from "@/components/MobileChatLayout";
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

const sideBarOptions: SideBarOption[] = [];

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
          {friends.length > 0 ? (
            <div className="text-sm font-semibold leading-6 text-gray-400"></div>
          ) : null}

          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li className="flex items-center gap-4 mt-6">
                <div className="relative w-16 h-16">
                  <Image
                    src="/img/landing/Logo-LandingBetter.svg"
                    alt="Logo"
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 uppercase">
                    {session.user.role === "student" ? "STUDENT" : "UČITEL"}
                  </span>
                  <span className="text-base font-semibold text-black">
                    {session.user.name}
                  </span>
                </div>
              </li>
              <li>
                <div className="w-full flex justify-center">
                  <div className="w-3/4 border-t border-gray-300 my-2"></div>
                </div>
              </li>
              <li>
                {/*
                <SidebarChatList friends={friends} sessionId={session.user.id} />
                
                */}
              </li>
              <li>
                <div className="text-sm font-semibold leading-6 text-gray-400">
                  Main
                </div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  <li>
                    <Link
                      href="/dashboard/findTeacher"
                      className="text-gray-700 hover:text-[#0072FA] hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 leading-6 font-semibold text-lg"
                    >
                      <div className="w-8 h-8 flex items-center justify-center">
                        <Image src="/img/Sidebar/Search_alt.svg" alt="search" width={26} height={26} className="" />
                      </div>
                      <p className="truncate">Hledat</p>
                    </Link>
                  </li>
                  {sideBarOptions.map((option) => {
                    const Icon = Icons[option.Icon];
                    return (
                      <li key={option.id}>
                        <Link
                          href={option.href}
                          className="text-gray-700 hover:text-[#0072FA] hover:bg-gray-50 group flex gap-3 rounded-md p-2 leading-6 font-semibold text-lg"
                        >
                          <div className="w-8 h-8 flex items-center justify-center">
                            <Icon className="h-6 w-6" />
                          </div>
                          <span className="truncate">{option.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                  <li>
                    <FriendMessagesSidebarOption sessionId={session.user.id} />
                  </li>
                  <li>
                    <Link
                      href="/dashboard/myLessons"
                      className="text-gray-700 hover:text-[#0072FA] hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 leading-6 font-semibold text-lg"
                    >
                      <div className="w-8 h-8 flex items-center justify-center">
                        <Image src="/img/Sidebar/MyLections.svg" alt="my-lessons" width={24} height={24} />
                      </div>
                      <p className="truncate">Moje lekce</p>
                    </Link>
                  </li>
                  <li>
                    <FriendRequestSidebarOption
                      sessionId={session.user.id}
                      initialUnseenRequestCount={unseenRequestCount}
                    />
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
              <li className="mt-8 flex items-center  w-full pb-4 gap-x-2 text-base">
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
