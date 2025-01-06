import { fetchRedis } from "@/helpers/redis";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {teacherId} = body;
    const teacherRaw = await fetchRedis("get", `user:${teacherId}`);
    const teacher = JSON.parse(teacherRaw);
    return new Response(JSON.stringify(teacher), { status: 200 });
  } catch {
    return new Response("Internal error", { status: 400 });
  }
}
