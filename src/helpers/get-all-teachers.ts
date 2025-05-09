import { fetchRedis } from "./redis";

export const getAllTeachers = async (page: number) => {

  const teachersPerPage = 5; 

  const teachersId = (await fetchRedis("smembers", `teachers`)) as string[];
  const totalTeachers = teachersId.length;
  const totalPages = Math.ceil(totalTeachers / teachersPerPage);
  const startIndex = (page - 1) * teachersPerPage;
  const endIndex = startIndex + teachersPerPage;

  const paginatedTeachersId = teachersId.slice(startIndex, endIndex);

  let C = 0;
  let x = 0;
  let y = 0;
  const M = 7;
  const teachers = await Promise.all(
    paginatedTeachersId.map(async (teacher) => {
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
        id,
        email,
        name,
        faculty,
        image,
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
      return combinedTeacherObject;
    })
  );
  
  C = x / y;

  teachers.forEach((teacher) => {
    const v = teacher.rating.length;
    teacher.bayasianrating =  (teacher.R * v + C * M) / (v + M);
  })

  teachers.sort((a, b) => b.bayasianrating - a.bayasianrating);

  return {teachers, totalPages};
};
