import Link from "next/link";
import React from "react";

interface Props {
  subjects: string[];
}

const Subjects = ({ subjects }: Props) => {

  return (
    <div className="flex gap-x-2">
      {subjects.map((subject, index) => (
        <Link href={`/dashboard?faculty=&subject=${subject}&search=`} key={index} className="bg-indigo-100 text-indigo-500 px-3 py-1 rounded-full text-sm">
            {subject}
        </Link>
      ))}
    </div>
  );
};

export default Subjects;
