const Line3 = () => {
  return (
    <div className="w-full mt-[160px] relative z-0 top-[260px]">
      <p className="absolute left-[5%] top-[-140px] text-[18px] font-bold bg-white bg-clip-text text-transparent bg-gradient-to-r from-[#0072FA] via-[#1D0A42] to-[#FF0049]">
        Lepší způsob, jak se učit a učit ostatní
      </p>
      <h2 className="absolute left-[5%] top-[-120px] text-[48px] bg-transparent font-bold text-[#1A1A1A]">
        Jak to funguje?
      </h2>
      <img
        src="/img/landing/LineBetter.svg"
        alt="Line with points"
        className="w-[450px] h-auto mx-auto"
      />
      <div className="absolute top-[10%] left-[10%] md:left-[15%] lg:left-[20%] text-left">
        <div className="flex items-center gap-4">
          <span className="text-[80px] leading-none font-bold text-[#2563EB]">
            01
          </span>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">
              Najdi učitele
            </h2>
            <p className="text-base text-[#1A1A1A] max-w-sm">
              Použij náš chytrý vyhledávač a <br />
              vyber si učitele podle předmětu, <br />
              hodnocení a ceny
            </p>
          </div>
        </div>
      </div>

      <div className="absolute top-[38%] left-[40%] md:left-[45%] lg:left-[50%] text-left">
        <div className="flex items-center gap-4">
          <span className="text-[80px] leading-none font-bold text-[#1D4ED8]">
            02
          </span>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">
              Rezervuj si lekci
            </h2>
            <p className="text-base text-[#1A1A1A] max-w-sm">
              Vyber si čas, který ti vyhovuje, a <br />
              rezervuj si lekci během pár kliknutí
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[0%] left-[10%] md:left-[50%] lg:left-[55%] text-left mt-10 md:mt-0">
        <div className="flex items-center gap-4">
          <span className="text-[80px] leading-none font-bold text-[#FF0149]">
            03
          </span>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">
              Uč se a zlepšuj se
            </h2>
            <p className="text-base text-[#1A1A1A] max-w-sm">
              Využij individuální přístup a zlepši <br />
              se ve škole nebo na zkoušky
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Line3;