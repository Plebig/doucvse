import { fetchRedis } from "@/helpers/redis";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {teacherId} = body;
    const teacherRaw = await fetchRedis("get", `user:${teacherId}`);
    const teacher = JSON.parse(teacherRaw);
    const teacherInformationRaw = await fetchRedis("get", `user:${teacherId}:information`);
    const teacherInformation = JSON.parse(teacherInformationRaw);
    const teacherWithinformation = {...teacher, ...teacherInformation};
    return new Response(JSON.stringify(teacherWithinformation), { status: 200 });
  } catch {
    return new Response("Internal error", { status: 400 });
  }
}
