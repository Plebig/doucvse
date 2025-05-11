"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { subjectsList } from "@/data/register/subjectsList";
import { set } from "date-fns";

const MAX_LIMIT = 3000;

const Filters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [faculty, setFaculty] = useState(searchParams?.get("faculty") || "");
  const [language, setLanguage] = useState(searchParams?.get("language") || "");
  const [subject, setSubject] = useState(searchParams?.get("subject") || "");
  const [format, setFormat] = useState(searchParams?.get("format") || "");
  const [minPrice, setMinPrice] = useState(
    searchParams?.get("minPrice") || "50"
  ); // string!
  const [maxPrice, setMaxPrice] = useState(
    searchParams?.get("maxPrice") || "3000"
  );

  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSubject(value);
    setIsSuggestionsOpen(true);
    if (value.length > 0) {
      const filteredSubjects = subjectsList.filter((subject) =>
        subject.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSubjects);
    } else {
      setSuggestions([]);
    }
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsSuggestionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleSuggestionClick = (suggestion: string) => {
    setSubject(suggestion);
    setSuggestions([]);
  };

  const updateSearchParams = (overrides?: {
    faculty?: string;
    language?: string;
    format? : string;
    subject?: string;
  }) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    const params = new URLSearchParams();

    const newFaculty = overrides?.faculty ?? faculty;
    const newLanguage = overrides?.language ?? language;
    const newFormat = overrides?.format ?? format;
    const newSubject = overrides?.subject ?? subject;
    const newMax = Math.min(Number(maxPrice) || 0, 3000);

    if (newFaculty) params.set("faculty", newFaculty);
    if (newSubject) params.set("subject", newSubject);
    if (newLanguage) params.set("language", newLanguage);
    if (newFormat) params.set("format", newFormat);
    if (newMax) params.set("maxPrice", String(newMax));

    router.push(`?${params.toString()}`);
  };


  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") return setMaxPrice("");

    const num = Math.min(Number(val), 3000);
    if (!isNaN(num)) setMaxPrice(String(num));
  };

  return (
    <div className="filters flex gap-x-4 mb-4">
      <form className="flex gap-x-4" onSubmit={(e) => e.preventDefault()}>
        <div className="flex justify-between items-center gap-4 w-full">
          <div className="flex flex-col w-full">
            <label htmlFor="faculty" className="text-xs text-gray-600 mb-1">
              Fakulta:
            </label>
            <select
              id="faculty"
              value={faculty}
              onChange={(e) => {
                setFaculty(e.target.value);
                updateSearchParams({ faculty: e.target.value });
              }}
              className="appearance-none border w-[200px] rounded px-2 py-1 pr-8 text-base"
            >
              <option value="">Všechny fakulty</option>
              <option value="FFÚ">FFÚ</option>
              <option value="FMW">FMW</option>
              <option value="FPH">FPH</option>
              <option value="FIS">FIS</option>
              <option value="NF">NF</option>
              <option value="FM">FM</option>
            </select>
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="subject" className="text-xs text-gray-600 mb-1">
              Předmět:
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onFocus={(e) => e.target.select()}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === "Enter" && updateSearchParams()}
              onBlur={() => updateSearchParams()}
              autoComplete="off"
              className="border rounded px-2 py-1"
            />
            <div>
              <div ref={dropdownRef} className="relative">
                {suggestions.length > 0 && isSuggestionsOpen && (
                  <ul className="border absolute w-full border-gray-300 mt-1 bg-white shadow-lg rounded-md max-h-80 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <li
                      
                        key={suggestion}
                        onClick={() => {handleSuggestionClick(suggestion);updateSearchParams({ subject: suggestion })}}
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0072FA] focus:border-indigo-500 sm:text-sm cursor-pointer"
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="language" className="text-xs text-gray-600 mb-1">
              jazyk:
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                updateSearchParams({ language: e.target.value });
              }}
              className="appearance-none border rounded w-full px-2 py-1 pr-8 text-base"
            >
              <option value="">Vsechny jazyky</option>
              <option value="čeština">čeština</option>
              <option value="slovenština">slovenština</option>
              <option value="ukrajinština">ukrajinština</option>
              <option value="angličtina">angličtina</option>
            </select>
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="maxPrice" className="text-xs text-gray-600 mb-1">
              Max do:
            </label>
            <input
              value={maxPrice}
              id="maxPrice"
              type="number"
              onFocus={(e) => e.target.select()}
              onChange={(e) => handleMaxPriceChange(e)}
              onKeyDown={(e) => e.key === "Enter" && updateSearchParams()}
              onBlur={() => updateSearchParams()}
              className="border rounded px-2 py-1"
            />
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="format" className="text-xs text-gray-600 mb-1">
              forma doučování:
            </label>
            <select
              id="format"
              value={format}
              onChange={(e) => {
                setFormat(e.target.value);
                updateSearchParams({ format: e.target.value });
              }}
              className="appearance-none border rounded w-full px-2 py-1 pr-8 text-base"
            >
              <option value="">Je mi to jedno</option>
              <option value="online">online</option>
              <option value="osobne">osobne</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Filters;
