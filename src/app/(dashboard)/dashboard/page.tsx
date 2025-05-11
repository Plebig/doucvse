import TeacherCard from "@/components/TeacherCard";
import { getAllTeachers } from "@/helpers/get-all-teachers";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";
import { takeCoverage } from "v8";

const DashboardPage = async ({ searchParams }: any) => {
  const session = await getServerSession(authOptions);
  const {page} = searchParams;
  let sessionId;
  if (!session) {
    sessionId = "";
  }
  else {
    sessionId = session.user.id;
  }

  const subjectList = [
    "Analýza a návrh informačních systémů",
    "Bezpečnost informačních systémů",
    "Datové minimum",
    "IT Governance",
    "Podnikové informační systémy",
    "Simulační modely pro informatiky",
    "Simulační modely pro informatiky",
    "UX design",
    "Zpracování informací a znalostí",
    "Ekonomie 1",
    "Finanční teorie, politika a instituce",
    "Matematika pro informatiky",
    "Statistiky pro informatiky",
    "Účetnictví I.",
    "Bakalářský seminář",
    "Databáze",
    "Informační a komunikační technologie",
    "Kvantitativní management",
    "Programování v Javě",
    "Softwarové inženýrství",
    "Základy odborné práce",
  ];

  const { faculty = "", subject = "", minPrice = "", maxPrice = "", language = "" } = searchParams || {};

  const teachersData = await getAllTeachers(Number(page) || 1, faculty, subject, minPrice, maxPrice, language);
  const teachers = teachersData.filteredTeachers

  return (
    <div className="container py-12 flex flex-col gap-y-4 overflow-y-scroll">

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
            senderId={sessionId}
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
    </div>
  );
};

export default DashboardPage;
