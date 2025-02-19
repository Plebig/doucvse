"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

type FormData = {
  faculty: string;
  major: string;
  year: string;
};

const StudentRegisterCompletationPage = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const router = useRouter();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const response = await fetch("/api/register/student-register-completation", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response.ok) {
      toast.success("Registrace dokončena");
      router.push("/dashboard");
    }
    else {
      toast.error("Nastala chyba zkuste to znovu později");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col">
          <label
            htmlFor="faculty"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Select Role
          </label>
          <select
            {...register("faculty", { required: true })}
            id="faculty"
            required
            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="FFÚ">FFÚ</option>
            <option value="FMW">FMW</option>
            <option value="FPH">FPH</option>
            <option value="FIS">FIS</option>
            <option value="NF">NF</option>
            <option value="FM">FM</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="major"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Obor
          </label>
          <input
            {...register("major")}
            type="text"
            id="major"
            required
            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Major"
          />
        </div>
        <div>
          <label
            htmlFor="year"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Momentální ročník
          </label>
          <input
            {...register("year")}
            type="text"
            id="year"
            required
            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Year"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none">
           Dokončit registraci
          </button>

      </form>
    </div>
  );
};

export default StudentRegisterCompletationPage;
