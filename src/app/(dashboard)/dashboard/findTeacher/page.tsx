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

  const teachersApiData = await getAllTeachers(Number(page) || 1, faculty, subject, minPrice, maxPrice, language);
  const teachersFiltered = teachersApiData.filteredTeachers;
  const totalPages = teachersApiData.totalPages;
  const teachers = teachersFiltered.slice(0, 10) || [];
  
  return (
    <div className="container py-12 flex flex-col gap-y-4 overflow-y-scroll">
      {/* Filter Links */}
      <Filters/>
      {teachers.map((teacher) => {
        const {
          id,
          email,
          name,
          userHeading,
          userDescription,
          price,
          subjects,
          image,
          faculty,
          languages
        } = teacher;
        const numberOfRatings = teacher.rating.length || 0; 
        const averageRating = teacher.R
        return (
          <TeacherCard
            key={email}
            senderId={session.user.id}
            teacherId={id}
            name={name}
            email={email}
            price={price}
            userHeading={userHeading}
            userDescription={userDescription}
            subjects={subjects}
            faculty={faculty}
            image={image}
            numberOfRatings={numberOfRatings}
            averageRating={averageRating}
            languages={languages}
          />
        );
      })}
      <PaginationsControl totalPages={totalPages} />
    </div>
  );
};

export default FindTeacherPage;
