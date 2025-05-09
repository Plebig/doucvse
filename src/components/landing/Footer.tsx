import Image from "next/image";
import FooterLine from "/img/landing/FooterLine.svg";
import Logo2 from "/img/landing/Logo2.svg";

const Footer = () => {
  return (
    <footer className="relative text-white mt-64 overflow-hidden">
      <Image
        src="/img/landing/FooterLine.svg"
        alt="Footer background"
        width={1920}
        height={500}
        className="absolute top-0 left-0 w-full h-[600px] sm:h-[700px] md:h-[900px] object-cover z-0"
      />
      <div className="relative z-10 max-w-7xl mx-auto pt-40 sm:pt-60 md:pt-80 pb-20 min-h-[60vh] sm:min-h-[70vh] md:min-h-0 px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-10 text-white items-start text-center sm:text-left">
        <div className="flex justify-center sm:justify-start items-center">
          <Image
            src="/img/landing/Logo2.svg"
            alt="Doucvse Logo"
            width={240}
            height={120}
            className="sm:ml-0 ml-[-80px] mt-4 sm:mt-0"
          />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-3">Menu</h3>
          <ul className="space-y-1">
            <li>Jak to funguje?</li>
            <li>Proč právě my?</li>
            <li>Recenze</li>
            <li>FAQ</li>
            <li>Kontakt</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-3">Kontakt</h3>
          <ul className="space-y-1">
            <li>Instagram</li>
            <li>Facebook</li>
            <li>Email</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-3">Registrace</h3>
          <ul className="space-y-1">
            <li>Přihlášení</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;