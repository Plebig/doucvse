"use client";
import React, { useState, Fragment, useEffect } from "react";

import {
  Dialog,
  Button,
  Transition,
} from "@headlessui/react";
import { Menu, X, User } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/Button";
import SignOutButton from "./SignOutButton";
import Image from "next/image";
import { Session } from "next-auth";
import { SideBarOption } from "@/types/typings";
import { usePathname } from "next/navigation";


interface MobileChatLayoutProps {
  friends: User[]
  session: Session
  sidebarOptions: SideBarOption[]
  unseenRequestCount: number
}



const MobileChatLayout = ({friends, session, sidebarOptions, unseenRequestCount}: MobileChatLayoutProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])
  return (
    <div className="fixed bg-zinc-50 border-b border-zinc-200 top-0 inset-x-0 py-2 px-4">
      <div className="w-full flex justify-between items-center">
        <Link
          href="/dashboard"
          className={buttonVariants({ variant: "ghost" })}
        >
          <Image
            src="/img/landing/Logo-LandingBetter.svg"
            alt="Logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </Link>
        <Button onClick={() => setOpen(true)} className="gap-4 flex">
          Menu <Menu className="h-6 w-6" />
        </Button>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <div className="fixed inset-0" />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-hidden bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                            Dashboard
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              onClick={() => setOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <X className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        {/* Content */}

                        {friends.length > 0 ? (
                          <div className="text-xs font-semibold leading-6 text-gray-400">
                            Your chat
                          </div>
                        ) : null}

                        <nav className="flex flex-1 flex-col">
                          <ul
                            role="list"
                            className="flex flex-1 flex-col gap-y-7"
                          >

                            <li className="flex items-start gap-4 mt-6">
                              <div className="relative w-16 h-16">
                                <Image
                                  src="/img/landing/Logo-LandingBetter.svg"
                                  alt="Logo"
                                  width={64}
                                  height={64}
                                  className="object-contain"
                                />
                              </div>
                              <div className="flex flex-col justify-center">
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
                              <div className="text-xs font-semibold leading-6 text-gray-400">
                                Main
                              </div>
                              <ul role="list" className="-mx-2 mt-2 space-y-1">
                                <li>
                                  <Link
                                    href="/dashboard/findTeacher"
                                    className="text-gray-700 hover:text-[#0072FA] hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                  >
                                    <div className="w-8 h-8 flex items-center justify-center">
                                      <Image src="/img/Sidebar/Search_alt.svg" alt="search" width={24} height={24} />
                                    </div>
                                    <span className="truncate">Hledat</span>
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href="/dashboard/messages"
                                    className="text-gray-700 hover:text-[#0072FA] hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                  >
                                    <div className="w-8 h-8 flex items-center justify-center">
                                      <Image src="/img/Sidebar/chat.svg" alt="chat" width={24} height={24} />
                                    </div>
                                    <span className="truncate">Zprávy</span>
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href="/dashboard/myLessons"
                                    className="text-gray-700 hover:text-[#0072FA] hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                  >
                                    <div className="w-8 h-8 flex items-center justify-center">
                                      <Image src="/img/Sidebar/MyLections.svg" alt="my-lessons" width={24} height={24} />
                                    </div>
                                    <span className="truncate">Moje lekce</span>
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href="/dashboard/requests"
                                    className="text-gray-700 hover:text-[#0072FA] hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                  >
                                    <div className="w-8 h-8 flex items-center justify-center text-black">
                                      <User className="h-6 w-6" />
                                    </div>
                                    <span className="truncate">Žádosti</span>
                                  </Link>
                                </li>
                              </ul>
                            </li>

                            <li className="-ml-6 mt-auto flex items-center">
                              <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
                                <div className="relative h-8 w-8 bg-gray-50 border border-red-500">
                                  <Image
                                    fill
                                    referrerPolicy="no-referrer"
                                    className="rounded-full"
                                    src={session.user.image || ""}
                                    alt="Your profile picture"
                                    loading="eager"
                                  />
                                </div>

                                <span className="sr-only">Your profile</span>
                                <div className="flex flex-col">
                                  <span aria-hidden="true">
                                    {session.user.name}
                                  </span>
                                  <span
                                    className="text-xs text-zinc-400"
                                    aria-hidden="true"
                                  >
                                    {session.user.email}
                                  </span>
                                </div>
                              </div>

                              <SignOutButton className="h-full aspect-square" />
                            </li>
                          </ul>
                        </nav>

                        {/* content end */}
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default MobileChatLayout;
