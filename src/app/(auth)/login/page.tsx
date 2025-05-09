"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Button from "../../../components/ui/Button";
import { useForm, SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";


const LoginPage = () => {
  const {
    handleSubmit,
  } = useForm<FormData>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const onSubmit: SubmitHandler<FormData> = async () => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.ok) {
        toast.success("Successfully logged in");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(result?.error || "Failed to login");
      }
    } catch (error) {
      toast.error("An unexpected error occurred23 " + error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3F8FF] px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-2xl">
        <h2 className="text-2xl font-bold text-center text-[#1C1C1C]">
          Přihlas se
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0072FA]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0072FA]"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#FF0049] text-white py-2 rounded-md hover:bg-[#FF0049] focus:outline-none"
          >
            Přihlásit se
          </Button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Pokud ještě nemáte účet tak se {" "}
          <a href="/register" className="text-[#FF0049] hover:underline">
            registrujte
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
