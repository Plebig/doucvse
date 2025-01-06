import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Button from "../components/ui/Button";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <Button variant='ghost'>Hello</Button>
      <h1>Hello { session && <span>{session.user!.name}</span>}</h1>
    </div>
  );
}
