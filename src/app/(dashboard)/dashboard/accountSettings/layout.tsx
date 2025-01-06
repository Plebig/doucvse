"use client"
import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import AccountSettingLink from "@/components/ui/AccountSettingLink"; // Adjust the import path as necessary

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  if (!pathname) return null;
  return (
    <div className="flex h-full">
      <div className="flex flex-col w-1/5 border-r-2 p-8 gap-y-2 h-full">
        <AccountSettingLink
          currentPath={pathname}
          href="/dashboard/accountSettings/edit"
        >
          Upravit profil
        </AccountSettingLink>
        <AccountSettingLink
          currentPath={pathname}
          href="/dashboard/accountSettings/friends"
        >
          upravit přátele
        </AccountSettingLink>
      </div>
      <div className="w-4/5">{children}</div>
    </div>
  );
};

export default Layout;