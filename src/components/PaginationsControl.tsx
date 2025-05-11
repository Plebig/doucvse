"use client";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CircleArrowLeft } from "lucide-react";
import { CircleArrowRight } from "lucide-react";

interface Props {
  totalPages: number;
}

const PaginationsControl = ({ totalPages }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams?.get("page") ?? "1";
  const isLeftDisabled = Number(page) <= 1;
  const isRightDisabled = Number(page) >= totalPages; // Assuming 10 is the max page number
  const pageNumbers = [];


  if(Number(page) == totalPages && totalPages > 2){
    pageNumbers.push(Number(page) - 2)
    pageNumbers.push(Number(page) - 1)
    pageNumbers.push(Number(page))

  }
  else if(Number(page) > 1 && totalPages > 2){
    pageNumbers.push(Number(page)-1)
    pageNumbers.push(Number(page))
    if(Number(page) < totalPages){
      pageNumbers.push(Number(page)+1)
    }
  }
  else if(totalPages = 1){
    pageNumbers.push(1);
  }
  else if(totalPages == 2){
    pageNumbers.push(Number(page)-1)
    pageNumbers.push(Number(page))
  }

  console.log("totalPages: " + totalPages)
  console.log("Page: ", page)


  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set("page", newPage.toString());
    router.push(`/dashboard/findTeacher/?${params.toString()}`);
  };

  return (
    <div className="flex gap-x-4 items-center justify-center">
      <button
        disabled={isLeftDisabled}
        onClick={() => goToPage(Number(page)-1)}
      >
        <CircleArrowLeft size={24} color="black" />
      </button>
      {pageNumbers.map((num) => (
        <button key={num}
        onClick={() => goToPage(num)}
        className={`px-3 py-1 rounded border ${
          num === Number(page) ? "bg-gray-300 font-bold" : "bg-white"
        }`}
        >
          {num}
        </button>
      ))}
      
      <button
        disabled={isRightDisabled}
        onClick={() => goToPage(Number(page)+1)}
      >
        <CircleArrowRight size={24} color="black" />
      </button>
    </div>
  );
};

export default PaginationsControl;
