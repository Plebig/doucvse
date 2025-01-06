import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { fetchRedis } from "@/helpers/redis";
import { lessonValidator } from "@/lib/validations/lesson";
import Lesson from "@/components/Lesson";
import Link from "next/link";

const MyLessonsPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const results: string[] = await fetchRedis(
    "zrange",
    `user:${session.user.id}:lessons`,
    0,
    -1
  );
  console.log("results " + results);
  const dbLessons = results.map((message) => {
    console.log("message " + message);
    try {
      console.log("message " + message);
      return lessonValidator.parse(JSON.parse(message));
    } catch (error) {
      console.error("Invalid message format:", error);
      throw error; // Rethrow or handle invalid message as needed
    }
  });

  const lessons = dbLessons.reverse();
  console.log("lesson " + lessons);
  // jine UI pro to kdyt ucim a pro to kdyz jsem student
  
  return (
    <>
      <div className="p-10">
        <div className="flex border-b-2 border-gray-200 pb-2 w-full gap-4">
          <Link
            href="/dashboard/myLessons"
            className="text-2xl font-bold text-indigo-600"
          >
            Moje lekce
          </Link>
          <Link
            href="/dashboard/myLessons/finished"
            className="text-2xl font-bold text-slate-600"
          >
            Ukončené lekce
          </Link>
        </div>
        <div>
          {lessons.map((lesson, index) => (
            <Lesson key={index} lesson={lesson} />
          ))}
        </div>
      </div>
    </>
  );
};

export default MyLessonsPage;
