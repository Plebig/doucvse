import { fetchRedis } from "./redis";

export const getAllTeachers = async () => {
  const teachersId = (await fetchRedis("smembers", `teachers`)) as string[];

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
        id,
        email,
        name,
        faculty,
        image,
      };

      return combinedTeacherObject;
    })
  );

  return teachers;
};
