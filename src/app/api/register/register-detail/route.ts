import { fetchRedis } from "@/helpers/redis";
import { db } from "@/lib/dbR";

/*
do user:id
pridat fakultu, obor, rocnik
do user:informace
pridat cena, predmety, jazyky, rating
*/

export async function POST(req: Request) {
  const body = await req.json();
  const {
    userId,
    faculty,
    major,
    year,
    languages,
    price,
    subjects,
  }: {
    userId: string;
    price: number;
    subjects: string;
    languages: string;
    faculty: string;
    major: string;
    year: string;
  } = body;

  try {

    const cleanString = (input: string): string => {
      return input.replace(/[^a-zA-Z]+$/, "");
    };

    const cleanedSubjects = cleanString(subjects);
    const subjectsArray = cleanedSubjects.split(", ");
    
    const userData = {
      price,
      subjects: subjectsArray,
      languages,
      rating: []
    };
    console.log(subjectsArray)
    const user = await fetchRedis("get", `user:${userId}`);
    const userObj = JSON.parse(user);
    userObj.faculty = faculty;
    userObj.major = major;
    userObj.year = year;

    await db.set(`user:${userId}`, JSON.stringify(userObj));

    await db.set(`user:${userId}:information`, JSON.stringify(userData))
    await db.sadd(`teachers`, `${userId}`)
    
    return new Response("ok")
  } catch {
    return new Response("Internal error", {status: 400})
  } 

}
