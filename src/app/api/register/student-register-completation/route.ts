import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server'
import { fetchRedis } from '@/helpers/redis';
import { db } from '@/lib/dbR';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {faculty, major, year} = body;
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    const userId = session.user.id;

    const user = await fetchRedis("get", `user:${userId}`);
    const userObj = JSON.parse(user);
    userObj.faculty = faculty;
    userObj.major = major;
    userObj.year = year;
    await db.set(`user:${userId}`, JSON.stringify(userObj));
    return new Response("OK", { status: 200 });

    console.log("bodydata" + JSON.stringify(body));
  } catch (error) {
    console.log("error" + error);
    return new Response("internal server error", { status: 500 });
  }
}