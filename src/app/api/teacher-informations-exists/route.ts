import { fetchRedis } from "@/helpers/redis";


export async function POST(req: Request) {
  const body = await req.json();
  const {
    userId
  }: {
    userId: string
  } = body;
  try {
    const teacherInformation = await fetchRedis("get", `user:${userId}:information`);
    const teacherInformationParsed = JSON.stringify(teacherInformation);
    if (teacherInformationParsed !== "null") {
      return new Response("OK", { status: 200 });
    } else {
      return new Response("information not found", { status: 400 });
    }
  } catch (error) {
    console.error("Error fetching teacher information:", error);
    return new Response("Internal Server Error", { status: 500 });
  }

}