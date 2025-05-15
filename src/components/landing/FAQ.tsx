"use client";

import { useState } from "react";
import Image from "next/image";
import ContactFormularPopUp from "../contact/ContactFormularPopUp";

const faqItems = [
  {
    question: "Jak si mohu najít učitele?",
    answer:
      "„Díky platformě jsem konečně našla učitele, který mi pomohl pochopit matiku. Zkoušku jsem zvládla s přehledem!” „Díky platformě jsem konečně našla učitele, který mi pomohl pochopit matiku. Zkoušku jsem zvládla s přehledem!”",
  },
  {
    question: "Kolik lekce stojí?",
    answer:
      "Cena lekce se liší podle učitele, předmětu a dalších faktorů. Najdeš ale učitele pro každý rozpočet.",
  },
  {
    question: "Jak probíhá platba?",
    answer:
      "Platba probíhá přes naši platformu, bezpečně a jednoduše. Vybereš si učitele, termín a zaplatíš kartou.",
  },
  {
    question: "Jak si mohu ověřit kvalitu učitele?",
    answer:
      "U každého učitele najdeš recenze od studentů, počet odučených lekcí a hodnocení kvality.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };


  return (
    <section id="faq" className="max-w-4xl mx-auto px-4 py-10">
      <p className="text-sm font-semibold mb-1">
        <span className="bg-gradient-to-r from-[#0072FA] via-[#1D0A42] to-[#FF0049] bg-clip-text text-transparent">
          Zeptej se nás na cokoliv, co tě zajímá
        </span>
      </p>
      <h2 className="text-3xl md:text-4xl font-bold mb-10">
        FAQ – Máte otázky? My máme odpovědi
      </h2>

      <div className="flex flex-col gap-4">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className={`transition-all duration-300 overflow-hidden rounded-2xl border ${
              openIndex === index
                ? "bg-white border border-[#0072FA]"
                : "bg-white border border-transparent shadow-md"
            }`}
          >
            <button
              onClick={() => toggleOpen(index)}
              className="w-full flex items-center justify-between text-left p-6 focus:outline-none"
            >
              <span className="text-lg font-semibold">{item.question}</span>
              <Image
                src={
                  openIndex === index
                    ? "/img/landing/Minus.svg"
                    : "/img/landing/Plus.svg"
                }
                alt={openIndex === index ? "Mínus" : "Plus"}
                width={32}
                height={32}
              />
            </button>
            {openIndex === index && (
              <div className="px-6 pb-6 text-gray-700">{item.answer}</div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-16">
        <h3 className="text-2xl font-semibold mb-6">
          Máte další otázky? Kontaktujte nás!
        </h3>
        <button
          className="px-10 py-4 rounded-full font-semibold text-white"
          style={{
            background:
              "linear-gradient(90deg, #0072FA 0%, #1D0A42 50%, #FF0049 100%)",
            boxShadow: "5px 15px 10px 0px rgba(0, 0, 0, 0.25)",
          }}
          onClick={() =>{ setIsFormOpen(!isFormOpen); console.log(isFormOpen)}}
        >
          Kontakt
        </button>
      </div>
      <ContactFormularPopUp isFormOpen={isFormOpen}  onClose={() => setIsFormOpen(false)}/>
    </section>
  );
};

export default FAQ;
