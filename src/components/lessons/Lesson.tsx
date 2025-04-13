import { fetchRedis } from "@/helpers/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import LessonClient from "./LessonClient";
import LessonClientFinished from "./LessonClientFinished";

interface Props {
  lesson: Lesson;
  type?: "finished" | "upcoming";
}

const Lesson = async ({ lesson, type }: Props) => {
  const session = await getServerSession(authOptions);

  if (!session) notFound();

  const rawTeacher = await fetchRedis("get", `user:${lesson.teacherId}`);
  const teacher = JSON.parse(rawTeacher);

  const rawStudent = await fetchRedis("get", `user:${lesson.studentId}`);
  const student = JSON.parse(rawStudent);

  return (
    <>
      {type === "upcoming" ? (
        <LessonClient
          lesson={lesson}
          session={session}
          teacher={teacher}
          student={student}
        />
      ) : (
        <LessonClientFinished
          lesson={lesson}
          session={session}
          teacher={teacher}
          student={student}
        ></LessonClientFinished>
      )}
    </>
  );
};

export default Lesson;
