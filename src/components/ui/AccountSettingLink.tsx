import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

interface CustomLinkProps {
  href: string;
  children: React.ReactNode;
  currentPath: string;
}

const CustomLink = ({ href, children, currentPath }: CustomLinkProps) => {
  const isActive = currentPath === href;

  return (
    <a href={href} className={`flex align-middle border-slate-600 border-2 rounded-xl p-3 text-xl transition-all ${
      isActive ? "text-indigo-600 font-bold" : "text-slate-800 hover:bg-slate-100"
    }`}>

        {children}

    </a>
  );
};

export default CustomLink;