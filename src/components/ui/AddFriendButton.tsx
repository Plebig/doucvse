"use client";

import React, { useState } from "react";
import Button from "./Button";
import { addFriendValidator } from "@/lib/validations/add-friend";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type FormData = z.infer<typeof addFriendValidator>;

const AddFriendButton = () => {
  const [showSuccesState, setShowSuccesState] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });

  const addFriend = async (email: string) => {
    try {
      const validatedEmail = addFriendValidator.parse({ email });

      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/friends/add`, {
        method: "POST",
        body: JSON.stringify({ email: validatedEmail }),
      })

      setShowSuccesState(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError("email", { message: error.message });
        return;
      }

      if (error instanceof AxiosError) {
        setError("email", { message: error.response?.data });
        return;
      }

      setError("email", { message: "something went wrong" });
    }
  };

  const onSubmit = (data: FormData) => {
    addFriend(data.email);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
      <label
        htmlFor="email"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Add friend by email
      </label>
      <div className="mt-2 flex gap-4">
        <input
          {...register("email")}
          type="text"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="friend@example.com"
        />
        <Button>Add</Button>
      </div>
      <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
      {showSuccesState ? (
        <p className="mt-1 text-sm text-green-600">friend request sent</p>
      ) : null}
    </form>
  );
};

export default AddFriendButton;
