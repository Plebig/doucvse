'use client';

import Image from 'next/image';

const Folders = () => {
  return (
    <section className="flex flex-col-reverse lg:flex-row items-center justify-center gap-10 px-4 lg:px-24 py-20">
      {/* Left - Folder Illustration */}
      <div className="relative w-[300px] md:w-[450px] h-[340px]">
        <Image
          src="/img/landing/Folder.svg"
          alt="Folders"
          layout="fill"
          objectFit="contain"
        />
      </div>

      {/* Right - Text Content */}
      <div className="max-w-xl text-left lg:text-left">
        <p className="text-sm font-semibold mb-1">
          <span className="bg-gradient-to-r from-[#0072FA] via-[#1D0A42] to-[#FF0049] bg-clip-text text-transparent">
            Všechno na jednom místě        
          </span>
        </p>
        <h2 className="text-4xl font-extrabold mb-4">S námi se naučíš VŠE od A do Z</h2>
        <p className="text-lg mb-6">
          Od algebry po cizí jazyky – najdeš tu lektora na každý předmět, který tě na škole potká. Ať potřebuješ zvládnout státnice z práva, pochopit integrály, nebo si jen oprášit angličtinu, jsi na správném místě.
        </p>
        <p className="text-lg font-semibold mb-2">Máme desítky předmětů ze všech oborů:</p>
        <ul className="space-y-2 text-lg">
          {[
            'technické',
            'humanitní',
            'ekonomické',
            'přírodní vědy',
            'jazyky i umění',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Image
                src="/img/landing/Blue-Dot.svg"
                alt="dot"
                width={10}
                height={10}
                className="mt-2"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Folders;