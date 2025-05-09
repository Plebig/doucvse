import Link from "next/link";

export default function Popup() {
  return (
    <div className="text-center mt-14 md:mt-24 mb-0 pb-0 space-y-4 px-4">
      <h2 className="text-3xl md:text-5xl font-bold text-[#1A1A1A] leading-tight">
        Začni studovat nebo učit ostatní a staň se <br className="hidden md:block" /> součástí naší rostoucí komunity
      </h2>
      <p className="text-base md:text-lg text-gray-700">
        Tvá cesta za lepšími výsledky začíná právě teď
      </p>
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center items-center">
        <button className="bg-[#0072FA] text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-semibold shadow-md hover:brightness-110 transition w-fit max-w-[200px]">
          Hledat učitele
        </button>
        <Link href="/register">
          <button className="bg-[#FF0049] text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-semibold shadow-md hover:brightness-110 transition w-fit max-w-[200px]">
            Začít učit
          </button>
        </Link>
      </div>
    </div>
  );
}