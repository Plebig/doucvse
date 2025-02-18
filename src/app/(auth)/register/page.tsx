"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import Button from "../../../components/ui/Button";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

type FormData = {
  name: string;
  surname: string;
  email: string;
  password: string;
  role: "student" | "teacher";
};

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
  } = useForm<FormData>();


  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();


  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
  
    try {
      // Creating FormData instance to include both form fields and file
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("surname", data.surname);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("role", data.role);

  
      // Ensure 'Content-Type' is not set manually when using FormData
      const response = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        if (response.status === 409) {
          toast.error("Uživatel s touto emailovou adresou již existuje");
        } else {
          toast.error("Nastala chyba zkustu to znovu později" + response.text());
        }
        setIsLoading(false);
        return;
      }
  
      const responseData = await response.json();
      if (data.role === "teacher") {
        try {
          await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
          });
          router.push(`/register/register-detail/id?userId=${responseData.userId}`);
        } catch (error) {
          console.error("Error logging in user:", error);
          toast.error("An error occurred. Please try again.");
        }
        router.refresh();
      }
  
      if (data.role === "student") {
        toast.success("Registration successful! Redirecting...");
        try {
          await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
          });
          router.push("/dashboard");
        } catch (error) {
          console.error("Error logging in user:", error);
          toast.error("An error occurred. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error registering user:", error);
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
        <h1 className="text-3xl font-bold text-gray-700">Register</h1>
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Jméno
          </label>
          <input
            {...register("name")}
            type="text"
            id="name"
            required
            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Tomi"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Příjmení
          </label>
          <input
            {...register("surname")}
            type="text"
            id="name"
            required
            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Paci"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            required
            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="email@example.com"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Password
          </label>
          <input
            {...register("password")}
            type="password"
            id="password"
            required
            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your password"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Select Role
          </label>
          <select
            {...register("role", { required: true })}
            id="role"
            required
            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
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

export default RegisterPage;
