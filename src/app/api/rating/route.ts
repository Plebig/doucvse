import { fetchRedis } from "@/helpers/redis";
import { db}  from "@/lib/dbR";
import { Console } from "console";
export async function POST(req: Request) {
    try
    {
      const body = await req.json();
      const { rating, teacherId, studentId } = body; 

      const teacherInformationRaw = await fetchRedis("get", `user:${teacherId}:information`);
      const teacherInformation = JSON.parse(teacherInformationRaw);

      if (!teacherInformation.rating || typeof teacherInformation.rating !== 'object') {
        teacherInformation.rating = {};
      }
  
      teacherInformation.rating[studentId] = rating;
      await db.set(`user:${teacherId}:information`,JSON.stringify(teacherInformation));
      
      return new Response(JSON.stringify({ message: "OK" }), { status: 200 });
    }
    catch (error) {
      return new Response(JSON.stringify({ message: "Error" }), { status: 500 });
    }
}