import Link from "next/link";
<div className="text-center mt-14 md:mt-24 space-y-3 md:space-y-3">
  <h1 className="text-8xl md:text-6xl font-bold text-[#1A1A1A] leading-tight">
    Najdi svého ideálního učitele, <br /> nebo se staň jedním z nich!
  </h1>
  <p className="text-base md:text-lg text-gray-700">
    Platforma, která spojuje studenty a učitele. Snadno, rychle a efektivně
  </p>
  <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center items-center">
    <button className="bg-[#0072FA] text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-semibold shadow-md hover:brightness-110 transition w-fit max-w-[200px]">
      Hledat učitele
    </button>
    <div
      style={{
        background: "linear-gradient(90deg, #FFB3C9 0%, #BF0C3F 100%)",
        padding: "2px",
        borderRadius: "20px"
      }}
    >
      <Link href="/register" className="bg-[#FF0049] brightness-100 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold shadow-md hover:brightness-110 transition w-fit max-w-[200px] inline-block text-center" style={{ borderRadius: "10px" }}>
        Začít učit
      </Link>
    </div>
  </div>
</div>