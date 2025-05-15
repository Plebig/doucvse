import TeacherCard from "@/components/TeacherCard";
import { getAllTeachers } from "@/helpers/get-all-teachers";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";
import PaginationsControl from "@/components/PaginationsControl";
import Filters from "@/components/Filters";

const FindTeacherPage = async ({ searchParams }: any) => {
  const session = await getServerSession(authOptions);

  if (!session) notFound();
  const { faculty = "", subject = "", minPrice = 0, maxPrice = 3000, page, language = "" } = searchParams || {};

  const teachersApiData = await getAllTeachers(Number(page) || 1, faculty, subject, maxPrice, language);
  const teachersFiltered: teacherR[] = teachersApiData.finalTeachers
  const totalPages = teachersApiData.totalPages;
  const teachers = teachersFiltered.slice(0, 5) || [];
  return (
    <div className="container py-12 flex flex-col gap-y-4 overflow-y-scroll">
      {/* Filter Links */}
      <Filters/>
      {teachers.map((teacher) => {
        return (
          <TeacherCard
            key={teacher.email}
            senderId={session.user.id}
            teacherId={teacher.id}
            teacher={teacher}
            />
        );
      })}
      <PaginationsControl totalPages={totalPages} page={Number(page) || 1}/>
    </div>
  );
};

export default FindTeacherPage;
