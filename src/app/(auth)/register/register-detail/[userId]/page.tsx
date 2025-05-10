"use client";

import React, { useEffect, useState, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Check, CirclePlus, X } from "lucide-react";
import { facultiesMajors } from "@/data/register/facultiesMajors";
import { subjectsList } from "@/data/register/subjectsList";
import { languagesList } from "@/data/register/languagesList";

type FormData = {
  userId: string;
  price: number;
  subjects: string;
  languages: string;
  faculty: string;
  major: string;
  year: number;
};

const RegisterDetailPage = () => {
  const searchParams = useSearchParams();

  if (!searchParams) {
    notFound();
  }
  const userId = searchParams.get("userId");
  const { register, handleSubmit } = useForm<FormData>();

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [selectedFaculty, setSelectedFaculty] = useState<string>("FIS");

  const majors = selectedFaculty ? facultiesMajors[selectedFaculty] : [];
  const [selectedMajor, setSelectedMajor] = useState<string>(majors[0]);

  useEffect(() => {
    setSelectedMajor(majors[0]);
    console.log(majors);
    console.log(facultiesMajors);
  }, [selectedFaculty]);

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    // Split the input by commas and trim any whitespace
    const lastTyped =
      value
        .split(",")
        .map((item) => item.trim())
        .pop() || "";

    if (lastTyped.length > 0) {
      const filteredSuggestions = subjectsList.filter((subject) =>
        subject.toLowerCase().includes(lastTyped.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue("");
    setSelectedSubjects((prev) => [...prev, suggestion]);
    setSuggestions([]);
  };

  const handleRemoveSubject = (subject: string) => {
    console.log(subject);
    setSelectedSubjects((prev) => prev.filter((item) => item !== subject));
  };

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const toggleSelect = (option: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    try {
      if (selectedSubjects.length === 0) {
        toast.error("Vyberte předměty");
        return;
      }
      if (selectedLanguages.length === 0) {
        toast.error("Vyberte jazyky");
        return;
      }
      if (data.price < 50 || data.price > 3000) {
        toast.error("Cena za hodinumusí být mezi 50 a 3000");
        return;
      }
      if(data.year > 12 || data.year < 1){
        toast.error("Zadejte platný semester");
        return;
      }
      const dataWithUserId = {
        ...data,
        userId,
        languages: selectedLanguages,
        subjects: selectedSubjects,
        major: selectedMajor,
      };
      console.log(dataWithUserId);
      dataWithUserId.price = parseInt(dataWithUserId.price.toString());
      const response = await fetch("/api/register/register-detail", {
        method: "POST",
        body: JSON.stringify(dataWithUserId),
      });
      console.log("here");
      if (response.status === 200) {
        toast.success("Details submitted successfully!");

        router.push("/dashboard");
        router.refresh();
      }
      if (response.status === 400) {
        toast.error("Error from api");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F3F8FF] px-2 sm:px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-6 sm:p-8 bg-white shadow-lg rounded-2xl flex flex-col justify-center space-y-6"
      >
        <h1 className="text-3xl font-bold text-gray-700">Registrace</h1>
        <div className="flex flex-col">
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Vyber svou fakult
          </label>
          {/* Faculty Dropdown */}
          <select
            {...register("faculty", { required: true })}
            onChange={(e) => {
              setSelectedFaculty(e.target.value);
              setSelectedMajor(""); // reset major
            }}
            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0072FA] focus:border-indigo-500 sm:text-sm"
          >
            {Object.keys(facultiesMajors).map((faculty) => (
              <option key={faculty} value={faculty}>
                {faculty}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="major"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Obor
          </label>
          <select
            {...(register("major"), { required: true })}
            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0072FA] focus:border-indigo-500 sm:text-sm"
            value={selectedMajor}
            onChange={(e) => setSelectedMajor(e.target.value)}
            disabled={!selectedFaculty}
          >
            {majors.map((major) => (
              <option key={major} value={major}>
                {major}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="year"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            V jakým semestru jsi?
          </label>
          <input
            {...register("year")}
            type="number"
            id="year"
            required
            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0072FA] focus:border-indigo-500 sm:text-sm"
            placeholder="semester"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="subjects"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Předměty které doučuješ
          </label>
          <div className="relative">
            <input
              type="text"
              id="subjects"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSuggestionClick(inputValue);
                }
              }}
              autoComplete="off"
              className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0072FA] focus:border-indigo-500 sm:text-sm"
              placeholder="Zadej předmět který chceš doučovat"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => {
                if (inputValue) {
                  setSelectedSubjects([...selectedSubjects, inputValue]);
                  setInputValue("");
                }
              }}
            >
              <CirclePlus />
            </button>
          </div>
          <div>
            <div className="relative">
              {suggestions.length > 0 && (
                <ul className="border absolute w-full border-gray-300 mt-1 bg-white shadow-lg rounded-md max-h-40 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
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
        <div className="flex gap-2 flex-wrap">
          {selectedSubjects.map((subject, index) => (
            <button
              type="button"
              key={index}
              className="bg-indigo-100 w-fit text-indigo-500 pl-3 pr-3 py-1 rounded-full text-sm flex items-center gap-1"
              id={index.toString()}
              onClick={() => handleRemoveSubject(subject)}
            >
              {subject}
              <X className="w-[12px] h-auto" />
            </button>
          ))}
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Cena za hodinu
          </label>
          <input
            {...register("price")}
            type="number"
            id="name"
            required
            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0072FA] focus:border-indigo-500 sm:text-sm"
            placeholder="300"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="languages"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Jazyky ve kterých doučuješ
          </label>
          <div
            ref={dropdownRef}
            className="relative inline-block w-full text-left"
          >
            <div>
              <button
                type="button"
                className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
              >
                {selectedLanguages.length > 0
                  ? selectedLanguages.join(", ")
                  : "jazyky ve kterých doučuješ"}
                <ChevronDown className="ml-2 h-5 w-5" />
              </button>
            </div>

            {isOpen && (
              <div className="absolute mt-2 w-full rounded-md border border-gray-300 bg-white shadow-lg z-10">
                <div className="max-h-60 overflow-auto py-1">
                  {languagesList.map((option) => (
                    <div
                      key={option}
                      onClick={() => toggleSelect(option)}
                      className={`flex justify-between items-center px-3 py-2 text-sm text-gray-900 cursor-pointer hover:bg-gray-100 ${
                        selectedLanguages.includes(option)
                          ? "bg-blue-50 border-l-4 border-blue-500"
                          : ""
                      }`}
                    >
                      <span>{option}</span>
                      {selectedLanguages.includes(option) && (
                        <Check className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <Button
          isLoading={isLoading}
          type="submit"
          variant="default"
          className="bg-[#FF0049]"
        >
          Dokončit
        </Button>
      </form>
    </div>
  );
};

export default RegisterDetailPage;
