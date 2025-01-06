"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { notFound, useRouter, useSearchParams } from "next/navigation";

type FormData = {
  userHeading: string;
  userDescription: string;
  price: number;
  subjects: string;
  userId: string;
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

  const subjectsList = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "History",
    "Geography",
    "English Literature",
    "Economics",
    "Philosophy",
  ];
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
  
    // Split the input by commas and trim any whitespace
    const lastTyped = value.split(',').map(item => item.trim()).pop() || '';
  
    if (lastTyped.length > 0) {
      const filteredSuggestions = subjectsList.filter(subject =>
        subject.toLowerCase().includes(lastTyped.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    // Append the clicked suggestion to the existing input
    const currentSubjects = inputValue.split(',').map(item => item.trim());
    currentSubjects[currentSubjects.length - 1] = suggestion; // Replace the last typed item with the suggestion
    setInputValue(currentSubjects.join(', ') + ', '); // Add a comma and space for further typing
    setSuggestions([]);
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    try {
      const dataWithUserId = { ...data, userId };
      console.log(dataWithUserId);
      const response = await fetch("/api/register/register-detail", {
        method: "POST",
        body: JSON.stringify(dataWithUserId),
      });
      console.log("here");
      if (response.status === 200) {
        toast.success("Details submitted successfully!");
        router.push("/login"); // Redirect to another page if needed
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md min-w-96 p-8 bg-white shadow-lg rounded-2xl flex flex-col justify-center space-y-6 "
      >
        <h1 className="text-3xl font-bold text-gray-700">Register {userId}</h1>
        <div className="flex flex-col">
          <label
            htmlFor="subjects"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Napiš své bio o sobě
          </label>
          <input
            {...register("userHeading")}
            type="text"
            id="userHeading"
            required
            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Jsem ve 4. na FPH"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="subjects"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Napiš popis ke svému účtu
          </label>
          <input
            {...register("userDescription")}
            type="text"
            id="userDescription"
            required
            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Jsem zapálený do matematiky"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="subjects"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Předměty které doučuješ (oddělené čárkou)
          </label>
          <input
            {...register("subjects")}
            type="text"
            id="subjects"
            value={inputValue}
            onChange={handleInputChange}
            required
            autoComplete="off"
            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="matematika, angličtina..."
          />
          {suggestions.length > 0 && (
            <ul className="border border-gray-300 mt-1 bg-white shadow-lg rounded-md max-h-40 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Cena za lekci
          </label>
          <input
            {...register("price")}
            type="number"
            id="name"
            required
            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="500 CZK"
          />
        </div>

        <Button
          isLoading={isLoading}
          type="submit"
          variant="default"
          className="bg-indigo-600"
        >
          Add
        </Button>
      </form>
    </div>
  );
};

export default RegisterDetailPage;
