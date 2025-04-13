import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { fetchRedis } from "@/helpers/redis";
import { lessonValidator } from "@/lib/validations/lesson";
import Lesson from "@/components/lessons/Lesson";
import Link from "next/link";

const MyFinishedLessonsPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const results: string[] = await fetchRedis(
    "zrange",
    `user:${session.user.id}:lessons`,
    0,
    -1
  );

  const dbLessons = results.map((message) => {
    try {
      if (JSON.parse(message).dateOfLesson < new Date().getTime()) {
        return lessonValidator.parse(JSON.parse(message));
      }
    } catch (error) {
      throw error; // Rethrow or handle invalid message as needed
    }
    return undefined;
  }).filter((lesson) => lesson !== undefined);

  const lessons = dbLessons.reverse();

  return (
    <>
      <div className="p-10">
        <div className="flex border-b-2 border-gray-200 pb-2 w-full gap-4">
          <Link
            href="/dashboard/myLessons"
            className="text-2xl font-bold text-slate-600"
          >
            Moje lekce
          </Link>
          <Link
            href="/dashboard/myLessons/finished"
            className="text-2xl font-bold text-indigo-600"
          >
            Ukončené lekce
          </Link>
        </div>
        {lessons.length === 0 ? (
          <h3>nemáte žádné Ukončené lekce</h3>
        ) : (
          <div>
            {lessons.map(
              (lesson, index) =>
                  <Lesson key={index} lesson={lesson} type="finished" />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default MyFinishedLessonsPage;
