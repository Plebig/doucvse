import React from "react";
import LectorCard from "./LectorCard";

const Lectors = () => {
  return (
    <section className="px-4 sm:px-8 md:px-16 lg:px-32 py-16">
      <div className="mb-10 px-4 lg:px-0 max-w-6xl mx-auto text-left">
        <p className="text-sm md:text-base font-semibold mb-2">
          <span className="bg-gradient-to-r from-[#0072FA] via-[#1D0A42] to-[#FF0049] bg-clip-text text-transparent">
            Na nic nečekejte a domluvte si první lekci          
          </span>
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mt-2 text-[#071849]">
          Vybraní lektoři
        </h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          <LectorCard
            name="Adam IV."
            subjects={["Matematika pro informatiky", "Čeština"]}
            description="Ahoj, jsem Adam a hledám lidi, co by chtěly doučování…"
            image="/img/landing/AdamIV.png"
            lessons={10}
            rating={3}
          />
          <LectorCard
            name="Adam II."
            subjects={["Fyzika", "Angličtina"]}
            description="Pomůžu ti s fyzikou a zlepšíš si angličtinu díky hravým lekcím na míru."
            image="/img/landing/AdamII.png"
            lessons={25}
            rating={2}
          />
          <LectorCard
            name="Koperník"
            subjects={["Astronomie", "Matematika"]}
            description="Jsem expert na pohyb planet, ale taky rád vysvětlím derivace a zlomky."
            image="/img/landing/Kopernik.png"
            lessons={42}
            rating={5}
          />
        </div>
      </div>
    </section>
  );
};

export default Lectors;