import { fetchRedis } from "@/helpers/redis";
import React from "react";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { chatHrefConstructor } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";

interface Props {
  lesson: Lesson;
}

const Lesson = async ({ lesson }: Props) => {


  const session = await getServerSession(authOptions);
  if (!session) notFound();

  if (session.user.id === lesson.studentId) {
    // jsem student
    const rawTeacher = await fetchRedis("get", `user:${lesson.teacherId}`);
    const teacher = JSON.parse(rawTeacher);
  
    console.log("lesson " + lesson);
    return (
      <div className="flex flex-col items-center justify-center mt-10">
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-md p-4">
          <div className="flex items-center mb-4">
            <div className="relative w-12 h-12 ">
              <Image
                fill
                src={teacher.image}
                alt="Teacher Profile"
                className="rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {teacher.name}
              </h3>
              <p className="text-sm text-gray-500">{teacher.email}</p>
              <h3 className="text-slate-800 font-bold ">učitel</h3>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Subject:</span> {lesson.subject}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Lesson Date:</span>{" "}
              {format(new Date(lesson.dateOfLesson), "dd.MM.yyyy")}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Time: {lesson.timeSlot}</span>
            </p>
          </div>
          <Link href={`/chat/${chatHrefConstructor(lesson.teacherId, lesson.studentId)}`} passHref>
            <button className="w-full px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg focus:ring-4 focus:ring-indigo-300 focus:outline-none">
              Message Teacher
            </button>
          </Link>
        </div>
      </div>
    );
  }
  else if (session.user.id === lesson.teacherId) {
    // jsem ucitel

    const rawStudent = await fetchRedis("get", `user:${lesson.studentId}`);
    const student = JSON.parse(rawStudent);
  
    console.log("lesson " + lesson);
    return (
      <div className="flex flex-col items-center justify-center mt-10">
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-md p-4">
          <div className="flex items-center mb-4">
            <div className="relative w-12 h-12 ">
              <Image
                fill
                src={student.image}
                alt="Student Profile"
                className="rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {student.name}
              </h3>
              <p className="text-sm text-gray-500">{student.email}</p>
              <h3 className="text-slate-800 font-bold ">student</h3>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Subject:</span> {lesson.subject}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Lesson Date:</span>{" "}
              {format(new Date(lesson.dateOfLesson), "dd.MM.yyyy")}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Time: {lesson.timeSlot}</span>
            </p>
          </div>
          <Link href={`/chat/${chatHrefConstructor(lesson.teacherId, lesson.studentId)}`} passHref>
            <button className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-300 focus:outline-none">
              Message Student
            </button>
          </Link>
        </div>
      </div>
    );
  }

  else {
    return (
      <></>
    )
  }

  
};

export default Lesson;
