import { parse } from "path";
import { fetchRedis } from "./redis";

export const getAllTeachers = async (
  page: number,
  faculty: string,
  subject: string,
  maxPrice: number,
  language: string
) => {
  const teachersPerPage = 5;

  const teachersId = (await fetchRedis("smembers", `teachers`)) as string[];
  const startIndex = (page - 1) * teachersPerPage;
  const endIndex = startIndex + teachersPerPage;

  let C = 0;
  let x = 0;
  let y = 0;
  const M = 7;
  const teachers = await Promise.all(
    teachersId.map(async (teacher) => {
      const teacherInformation = (await fetchRedis(
        "get",
        `user:${teacher}:information`
      )) as string;
      const teacherUser = await fetchRedis("get", `user:${teacher}`);
      const parsedTeacherUser = JSON.parse(teacherUser);
      const { id, email, name, faculty, image } = parsedTeacherUser;
      const parsedTeacherInformation = JSON.parse(teacherInformation);

      const combinedTeacherObject = {
        ...parsedTeacherInformation,
        ...parsedTeacherUser,
      };
      let R = 0;
      const sum = parsedTeacherInformation.rating.reduce(
        (acc: number, r: number) => acc + r,
        0
      );
      const length = parsedTeacherInformation.rating.length;
      if (length > 0) {
        R = sum / length;
      } else {
        R = 0;
      }
      combinedTeacherObject.R = Math.round(R * 10) / 10;
      x += R;
      y += 1;
      console.log("combinedTeacherObject");
      console.log(combinedTeacherObject);
      return combinedTeacherObject;
    })
  );

  C = x / y;

  teachers.forEach((teacher) => {
    const v = teacher.rating.length;
    teacher.bayasianrating = (teacher.R * v + C * M) / (v + M);
  });

  teachers.sort((a, b) => b.bayasianrating - a.bayasianrating);

  const filteredTeachersAll = teachers.filter((teacher) => {
    const matchesFaculty = faculty ? teacher.faculty === faculty : true;
    const matchesSubject = subject
      ? teacher.subjects &&
        teacher.subjects.some(
          (subj: string) => subj.toLowerCase() === subject.toLowerCase()
        )
      : true;
    const matchesPrice =
      maxPrice ?  teacher.price <= maxPrice
        : true;
    const matchesLanguage = language ? teacher.languages.includes(language) : true;
    return matchesFaculty && matchesPrice && matchesSubject && matchesLanguage;
  });

  const totalPages = Math.ceil(filteredTeachersAll.length / teachersPerPage);
  const filteredTeachers = filteredTeachersAll.slice(
    startIndex,
    endIndex
  )
  filteredTeachers.map((teacher) => (console.log(teacher)));
  const finalTeachers: teacherR[] = filteredTeachers.map((teacher) => ({
    id: teacher.id,
    email: teacher.email,
    name: teacher.name,
    role: "teacher",
    faculty: teacher.faculty,
    major: teacher.major,
    year: teacher.year,
    image: teacher.image,
    price: teacher.price,
    subjects: teacher.subjects,
    languages: teacher.languages,
    rating: teacher.rating,
    R: teacher.R,
    form: teacher.form,
    city: teacher.city
  }))
  return { finalTeachers, totalPages };
};
