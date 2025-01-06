import React from "react";
import FirstMessageButton from "./FirstMessageButton";
import Image from "next/image";
import Link from "next/link";
import Button from "./ui/Button";

interface Props {
  senderId: string;
  teacherId: string;
  name: string;
  email: string;
  userHeading: string;
  userDescription: string;
  price: string;
  subjects: string;
  faculty: string;
  image: string;
}

const TeacherCard = ({
  senderId,
  teacherId,
  name,
  email,
  userHeading,
  price,
  subjects,
  faculty,
  image,
}: Props) => {
  return (
    <div className="max-w-sm rounded-lg shadow-md p-6 bg-white text-gray-900 flex flex-col justify-between h-full border border-gray-200">
      {/* Header section with avatar and name */}
      <div className="flex flex-col">
        <div className="flex items-center ">
          <div className="relative h-8 w-8 bg-gray-50 mr-2">
            <Link href={`dashboard/teacherProfile/${teacherId}`}>
              <Image
                fill
                referrerPolicy="no-referrer"
                className="rounded-full"
                src={image}
                // src="/profilePictures/aiImage.webp"
                alt="Your profile image"
              />
            </Link>
          </div>
          <Link href={`dashboard/teacherProfile/${teacherId}`}>
            <div className="text-lg font-bold">{name}</div>
          </Link>
        </div>
        <Link href={`dashboard/teacherProfile/${teacherId}`}>
          <p className="ml-14 text-gray-400">{email}</p>
        </Link>
      </div>

      {/* Description section */}
      <div className="text-gray-600 mb-6 flex flex-col gap-y-3">
        <p>{faculty}</p>
        <p>{userHeading}</p>
        <p>{subjects}</p>
      </div>

      {/* Footer section with price and button */}
      <div className="flex items-center justify-between mt-auto">
        <div className="text-lg font-semibold text-indigo-600">
          Cena <span className="font-bold">{price}</span>
        </div>
        {/*
        odeslat friend request zaroven se zpravou
         */}
        {senderId === "" ? <Button variant={"indigo"} ><a href="/login" >odeslat zprávu</a></Button>:(<FirstMessageButton
          senderId={senderId}
          teacherId={teacherId}
          teacherEmail={email}
        />)}

      </div>
    </div>
  );
};

export default TeacherCard;
