"use client";

import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

type FormDataInformation = {
  userHeading: string;
  userDescription: string;
  subjects: string;
  price: string;
};

type UserSettingsFormProps = {
  session: any;
  userInformation: FormDataInformation;
};

const UserSettingsForm: React.FC<UserSettingsFormProps> = ({ session, userInformation }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormDataInformation>();

  useEffect(() => {
    // Populate the form with existing user information
    setValue("userHeading", userInformation.userHeading);
    setValue("userDescription", userInformation.userDescription);
    setValue("subjects", userInformation.subjects);
    setValue("price", userInformation.price);
  }, [userInformation, setValue]);

  const onSubmit: SubmitHandler<FormDataInformation> = async (data) => {
    try {
      //const response = await axios.post("/api/update-teacher-infomation", {
      //  userId: session.user.id,
      //  ...data,
      //});

      const response = await fetch(`/api/update-teacher-infomation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          ...data,
        }),
      });

      if (response.ok) {
        toast.success("User information updated successfully!");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container py-12">
      <h1 className="font-bold text-2xl text-gray-700">User Settings</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-900 mb-1">
            Bio
          </label>
          <textarea
            {...register("userHeading", { required: true })}
            id="bio"
            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-1">
            Description
          </label>
          <textarea
            {...register("userDescription", { required: true })}
            id="description"
            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="subjects" className="block text-sm font-medium text-gray-900 mb-1">
            Subjects
          </label>
          <input
            {...register("subjects", { required: true })}
            type="text"
            id="subjects"
            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.subjects && <span className="text-red-500">Subjects are required</span>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="price" className="block text-sm font-medium text-gray-900 mb-1">
            Price
          </label>
          <input
            {...register("price", { required: true })}
            type="text"
            id="price"
            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.price && <span className="text-red-500">Price is required</span>}
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UserSettingsForm;