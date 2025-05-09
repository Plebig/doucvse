import { db } from "@/lib/dbR";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { lessonValidator } from "@/lib/validations/lesson";

export async function POST(req: Request) {
  const body = await req.json();
  const lessonRaw : Lesson = body.lesson;  
  const requestId : string = body.requestId;
  const lesson:Lesson = lessonValidator.parse(lessonRaw);
  try {
    await db.zadd(`user:${lesson.teacherId as string}:lessons`, {
      score: lesson.dateOfLesson,
      member: JSON.stringify(lesson),
    });
  
    await db.zadd(`user:${lesson.studentId}:lessons`, {
      score: lesson.dateOfLesson,
      member: JSON.stringify(lesson),
    });
  
    await pusherServer.trigger(
      toPusherKey(`lessonPurchased:${requestId}`),
      "lesson-purchased",
      lesson
    );
    return new Response("OK");
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }

}