import { db } from "@/lib/dbR";

export async function POST(req: Request) {
  const body = await req.json();
  const {
    userHeading,
    userDescription,
    price,
    subjects,
    userId
  }: {
    userHeading: string;
    userDescription: string;
    price: string;
    subjects: string;
    userId: string
  } = body;

  try {
    const userData = {
      userHeading,
      userDescription,
      price,
      subjects,
      rating: []
    };

    await db.set(`user:${userId}:information`, JSON.stringify(userData))
    await db.sadd(`teachers`, `${userId}`)
    return new Response("ok")
  } catch {
    return new Response("Internal error", {status: 400})
  } 

}
