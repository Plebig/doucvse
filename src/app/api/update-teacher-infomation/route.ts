import { fetchRedis } from "@/helpers/redis";
import { db } from "@/lib/dbR";


type UserInformation = { 
  price: string;
  rating: string[];
  subjects: string;
  userDescription: string;
  userHeading: string;
}

export async function POST(req: Request) {
  try {
    
    const body = await req.json();
    
    const { userId, userHeading, userDescription, subjects, price } = body;

    const old = await fetchRedis("get", `user:${userId}:information`);
    const parsedOld = JSON.parse(old);
    const oldRating = parsedOld.rating;

    const newObj = { userHeading,userDescription, subjects, price, rating: oldRating } as UserInformation;
    db.set(`user:${userId}:information`, newObj);
    
    return new Response("OK");
  } catch  {
    return new Response("error updating user", { status: 400 });
  }
}
