import TeacherCard from "@/components/TeacherCard";
import { getAllTeachers } from "@/helpers/get-all-teachers";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";

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

  const { faculty = "", subject = "", search = "" } = searchParams || {};

  const teachersData = await getAllTeachers(Number(page) || 1);
  const teachers = teachersData.teachers
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesFaculty = faculty ? teacher.faculty === faculty : true;
    const matchesSubject = subject
      ? teacher.subjects.some((subj: string) =>
          subj.toLowerCase().includes(subject.toLowerCase())
        )
      : true;
    const matchesSearch = search
      ? teacher.name.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesFaculty && matchesSearch && matchesSubject;
  });

  return (
    <div className="container py-12 flex flex-col gap-y-4 overflow-y-scroll">

      {/* Filter Links */}
      <div className="filters flex gap-x-4 mb-4">
        <form method="get" className="flex gap-x-4">
          {/* Faculty filter */}
          <select
            name="faculty"
            defaultValue={faculty}
            className="border pb-2 pt-2 pl-4   rounded"
          >
            <option value="">Všechny fakulty</option>
            <option value="FFÚ">FFÚ</option>
            <option value="FMW">FMW</option>
            <option value="FPH">FPH</option>
            <option value="FIS">FIS</option>
            <option value="FM">NF</option>
            <option value="FM">FM</option>

            {/* Add more options as needed */}
          </select>

          <input
            type="text"
            name="subject"
            placeholder="Search by subject..."
            defaultValue={subject}
            list="subject-suggestions"
            className="border p-2 rounded"
          />
          <datalist id="subject-suggestions">
            {subjectList.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </datalist>

          {/* Search filter */}
          <input
            type="text"
            name="search"
            placeholder="Search by name..."
            defaultValue={search}
            className="border p-2 rounded"
          />

          {/* Submit Button */}
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">
            Apply
          </button>
        </form>
      </div>

      {filteredTeachers.map((teacher) => {
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
          />
        );
      })}
    </div>
  );
};

export default DashboardPage;
