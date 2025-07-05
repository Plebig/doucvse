'use client';
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-transparent py-6 px-6 sm:px-12 overflow-x-hidden">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center mb-[100px]">
        <div className="flex items-center gap-4 ml-[-0px]">
          <Link href="/">
            <Image
              src="/img/landing/Logo-LandingBetter.svg"
              alt="Logo"
              width={120}
              height={120}
              className="w-[120px] h-[120px] ml-[-20px]"
              
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center text-sm font-medium text-black">
          <div className="flex gap-[80px] mr-[160px]">
            <Link href="#jak-to-funguje">
              <button className="text-black text-[20px] font-medium w-auto h-[50px] flex items-center justify-center hover:text-blue-600">
                Jak&nbsp;to&nbsp;funguje?
              </button>
            </Link>
            <Link href="#proc-my">
              <button className="text-black text-[20px] font-medium w-auto h-[50px] flex items-center justify-center hover:text-blue-600">
                Proč&nbsp;právě&nbsp;my?
              </button>
            </Link>
            <Link href="#lektori">
              <button className="text-black text-[20px] font-medium w-[76px] h-[50px] flex items-center justify-center hover:text-blue-600">
                Lektoři
              </button>
            </Link>
            <Link href="#faq">
              <button className="text-black text-[20px] font-medium w-[76px] h-[50px] flex items-center justify-center hover:text-blue-600">
                FAQ
              </button>
            </Link>
          </div>
          <Link href="/register">
            <button
              className="text-white font-semibold text-[20px] hover:brightness-110 transition-all"
              style={{
                background: "linear-gradient(180deg, #0072FA 0%, #1D0A42 50%, #FF0049 100%)",
                width: "211px",
                height: "67px",
                borderRadius: "20px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                border: "2x solid",
                borderImage: "linear-gradient(90deg, #3691FE 0%, #FF3A72 100%)",
                borderImageSlice: 1
              }}
            >
              Přihlášení
            </button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-3xl">
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden flex flex-col items-start gap-4 px-6 mt-4">
          <Link href="#jak-to-funguje" className="text-black text-[20px] font-medium hover:text-blue-600">
            Jak to funguje?
          </Link>
          <Link href="#proc-my" className="text-black text-[20px] font-medium hover:text-blue-600">
            Proč právě my?
          </Link>
          <Link href="#recenze" className="text-black text-[20px] font-medium hover:text-blue-600">
            Recenze
          </Link>
          <Link href="#faq" className="text-black text-[20px] font-medium hover:text-blue-600">
            FAQ
          </Link>
          <Link href="#kontakt" className="text-black text-[20px] font-medium hover:text-blue-600">
            Kontakt
          </Link>
          <Link href="/register">
            <button
              className="text-white font-semibold text-[20px] hover:brightness-110 transition-all mt-2"
              style={{
                background: "linear-gradient(180deg, #0072FA 0%, #1D0A42 50%, #FF0049 100%)",
                width: "239px",
                height: "67px",
                borderRadius: "20px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                border: "2x solid",
                borderImage: "linear-gradient(90deg, #3691FE 0%, #FF3A72 100%)",
                borderImageSlice: 1
              }}
            >
              Přihlášení
            </button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;