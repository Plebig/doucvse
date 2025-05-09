import Image from 'next/image';

const Board = () => {
  return (
    <section className="z-[1] mt-60 md:mt-45 w-full max-w-[90vw] lg:max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-center px-4 sm:px-6 md:px-8 lg:px-10 py-20 md:py-36 gap-6 lg:gap-10 overflow-hidden">
      <div className="flex-1 max-w-xl">
        <p className="text-sm font-semibold mb-1">
          <span className="bg-gradient-to-r from-[#0072FA] via-[#1D0A42] to-[#FF0049] bg-clip-text text-transparent">Zaregistruj se ještě dnes </span>
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#202020] mb-6">Proč právě naše platforma?</h2>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <Image src="/img/landing/Check-Box.svg" alt="check" width={24} height={24} />
            <span>
              <strong>Ověření učitelé:</strong> Všichni učitelé mají hodnocení od studentů
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Image src="/img/landing/Check-Box.svg" alt="check" width={24} height={24} />
            <span>
              <strong>Osobní přístup:</strong> Učitelé přizpůsobí výuku tvým potřebám
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Image src="/img/landing/Check-Box.svg" alt="check" width={24} height={24} />
            <span>
              <strong>Flexibilita:</strong> Vyber si čas a formu, která ti vyhovuje (online/offline)
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Image src="/img/landing/Check-Box.svg" alt="check" width={24} height={24} />
            <span>
              <strong>Skvělá komunita:</strong> Staň se součástí motivované a podporující komunity studentů a učitelů
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Image src="/img/landing/Check-Box.svg" alt="check" width={24} height={24} />
            <span>
              <strong>Dostupné ceny:</strong> Najdeš učitele pro každý rozpočet
            </span>
          </li>
        </ul>
      </div>
      <div className="flex-1">
        <Image
          src="/img/landing/Sticker-Board.svg"
          alt="Board illustration"
          width={300}
          height={240}
          className="w-full h-auto max-w-[280px] sm:max-w-sm mx-auto z-10"
        />
      </div>
    </section>
  );
};

export default Board;