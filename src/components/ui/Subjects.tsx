import Link from "next/link";
import React from "react";

interface Props {
  subjects: string;
}

const Subjects = ({ subjects }: Props) => {
  const cleanString = (input: string): string => {
    return input.replace(/[^a-zA-Z]+$/, "");
  };

  const cleanedSubjects = cleanString(subjects);

  const cleandeSubjectsArray = cleanedSubjects.split(", ");
  console.log(cleandeSubjectsArray);
  return (
    <div className="flex gap-x-2">
      {cleandeSubjectsArray.map((subject, index) => (
        <Link href={`/dashboard?faculty=&subject=${subject}&search=`} key={index} className="bg-indigo-100 text-indigo-500 px-3 py-1 rounded-full text-sm">
            {subject}
        </Link>
      ))}
    </div>
  );
};

export default Subjects;
