"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CircleArrowLeft } from "lucide-react";
import { CircleArrowRight } from "lucide-react";

interface Props {
  totalPages: number;
  page: number;
}

const PaginationsControl = ({ totalPages, page }: Props) => {
  const router = useRouter();

  const isLeftDisabled = Number(page) <= 1;
  const isRightDisabled = Number(page) >= totalPages;
  const pageNumbers = [];

  if (Number(page) === totalPages && totalPages > 2) {
    pageNumbers.push(Number(page) - 2);
    pageNumbers.push(Number(page) - 1);
    pageNumbers.push(Number(page));
  } else if (Number(page) > 1 && totalPages > 2) {
    pageNumbers.push(Number(page) - 1);
    pageNumbers.push(Number(page));
    if (Number(page) < totalPages) {
      pageNumbers.push(Number(page) + 1);
    }
  } else if (Number(page) === 1 && totalPages > 2) {
    pageNumbers.push(Number(page));
    pageNumbers.push(Number(page) + 1);
    pageNumbers.push(Number(page) + 2);
  } else if (totalPages === 1) {
    pageNumbers.push(1);
  } else if (totalPages === 2) {
    pageNumbers.push(Number(page) - 1);
    pageNumbers.push(Number(page));
  }


  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`/dashboard/findTeacher/?${params.toString()}`);
  };
  return (
    <div className="flex gap-x-4 items-center justify-center">
      <button
        disabled={isLeftDisabled}
        onClick={() => goToPage(Number(page) - 1)}
      >
        <CircleArrowLeft size={24} color="black" />
      </button>
      {pageNumbers.map((num) => (
        <button
          key={num}
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
        onClick={() => goToPage(Number(page) + 1)}
      >
        <CircleArrowRight size={24} color="black" />
      </button>
    </div>
  );
};

export default PaginationsControl;
