"use client";

import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import toast from "react-hot-toast";


type FormDataInformation = {
  userId: string;
  newEmail: string;
  newName: string;
  newPassword?: string | null;
  newPasswordConfirm?: string | null;
  currentPassword: string;
};

type UserSettingsFormProps = {
  session: any;
};

const UserSettingsForm: React.FC<UserSettingsFormProps> = ({ session }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormDataInformation>();

  useEffect(() => {
    // Populate the form with existing user information
    setValue("newEmail", session.user.email);
    setValue("newName", session.user.name);
  }, [session.user.name, session.user.email, setValue]);

  const onSubmit: SubmitHandler<FormDataInformation> = async (data) => {

    if (data.newPassword && data.newPassword !== data.newPasswordConfirm) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      const updateData: FormDataInformation = {
        userId: session.user.id,
        newEmail: data.newEmail,
        currentPassword: data.currentPassword,
        newName: data.newName,
      };

      if (data.newPassword) {
        updateData.newPassword = data.newPassword;
      }

      const response = await fetch(`/api/update-user-information`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      const responseData = await response.json();

      if (response.ok) {

        toast.success("User information updated successfully!");

        setValue("newEmail", data.newEmail);
        setValue("newName", data.newName === "" ? session.user.name : data.newName);
        // Clear the password fields
        setValue("newPassword", "");
        setValue("newPasswordConfirm", "");
        setValue("currentPassword", "");
      }
      if(responseData.message === "Current password is incorrect" && response.status === 400){
        toast.error("momentální heslo je nesprávné");
      }
    } catch {
        toast.error("Internal error occured please try again later");
    }
  }

  return (
    <div className="container py-12">
      <h1 className="font-bold text-2xl text-gray-700">User Settings</h1>
      <p className="mb-5">
        pro změnění těchto údajů zadejte vaše momentální heslo
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col gap-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              Email
            </label>
            <input
              {...register("newEmail", { required: true })}
              type="email"
              id="email"
              required
              placeholder="email@example.com"
              className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.newEmail && (
              <span className="text-red-500">Email is required</span>
            )}
          </div>
          <div>
          <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              Jméno
            </label>
            <input
              {...register("newName", { required: true })}
              type="name"
              id="name"
              required
              placeholder="jméno"
              className="bg-white block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.newName && (
              <span className="text-red-500">Email is required</span>
            )}
          </div>
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              Nové heslo
            </label>
            <input
              {...register("newPassword", { required: false })}
              type="password"
              id="newPassword"
              className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.newPassword && (
              <span className="text-red-500">
                newPasswordError {errors.newPassword.message}
              </span>
            )}
          </div>
          <div>
            <label
              htmlFor="newPasswordConfirm"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              Nové heslo znovu
            </label>
            <input
              {...register("newPasswordConfirm", { required: false })}
              type="password"
              id="newPasswordConfirm"
              className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.newPasswordConfirm && (
              <span className="text-red-500">
                Password confirmation is required
              </span>
            )}
          </div>
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              Momentální heslo
            </label>
            <input
              {...register("currentPassword", { required: true })}
              type="password"
              id="currentPassword"
              required
              className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.currentPassword && (
              <span className="text-red-500">Password is required</span>
            )}
          </div>
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
