import Board from "../components/landing/Board";
import Folders from "../components/landing/Folders";
import Lectors from "../components/landing/Lectors";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LandingBackground from "../components/landing/LandingBackground";
import Navbar from "../components/landing/Navbar";
import Line3 from "../components/landing/Line3";
import FAQ from "../components/landing/FAQ";
import Popup from "../components/landing/Popup";
import Roles from "../components/landing/Roles";
import Pin from "../components/landing/Pin";
import Footer from "../components/landing/Footer";
export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="relative w-full min-h-screen text-black z-0 bg-[#F3F8FF] ">
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none select-none">
        <LandingBackground />
      </div>
      <Navbar />
      <section className="text-center relative z-10 px-4 py-6">
        <h1 className="text-3xl md:text-6xl font-bold text-[#1A1A1A] leading-tight">
          Najdi svého ideálního učitele, <br /> nebo se staň jedním z nich!
        </h1>
        <p className="text-base md:text-lg text-gray-700 mt-4">
          Platforma, která spojuje studenty a učitele. Snadno, rychle a
          efektivně
        </p>
        <div className="mt-6 flex flex-col md:flex-row gap-3 justify-center items-center">
          <button className="bg-[#2563EB] text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-semibold shadow-md hover:brightness-110 transition w-full max-w-[280px] md:max-w-none md:w-auto">
            Hledat učitele
          </button>
          <button className="bg-[#FF0049] text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-semibold shadow-md hover:brightness-110 transition w-full max-w-[280px] md:max-w-none md:w-auto">
            Začít učit
          </button>
        </div>
      </section>

      <Line3 />
      <Board />
      <Folders />
      <Lectors />
      <Roles />
      <Pin />
      <FAQ />
      <Popup />
      <Footer />
    </main>
  );
}
