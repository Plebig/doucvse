import { fetchRedis } from "@/helpers/redis";

export async function POST(req: Request) {
  const body = await req.json();
  const lesson = body.lesson;
  console.log(lesson);
  try {
    const rawTeacher = await fetchRedis("get", `user:${lesson.teacherId}`);
    const rawStudent = await fetchRedis("get", `user:${lesson.studentId}`);
    const teacherEmail = JSON.parse(rawTeacher).email;
    const studentEmail = JSON.parse(rawStudent).email;

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

    const emailToTeacher: emailInfo = {
      to: teacherEmail,
      subject: "Nové doučování",
      text: "Bude doucko",
      html: "<b>Bude doučko konecne</b>",
    };

    const emailToStudent: emailInfo = {
      to: studentEmail,
      subject: "zarezervovali jste jsi Nové doučování",
      text: "Bude doucko",
      html: "<b>Bude doučko konecne</b>",
    };

    await fetch(`${baseUrl}/api/send-email`, {
      method: "POST",
      body: JSON.stringify(emailToTeacher),
    });

    await fetch(`${baseUrl}/api/send-email`, {
      method: "POST",
      body: JSON.stringify(emailToStudent),
    });
    
    return new Response("OK");
  } catch(error) {
    console.log(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
