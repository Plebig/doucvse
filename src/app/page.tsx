import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Button from "../components/ui/Button";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <ul>
        <li className=" mt-auto flex items-center  w-full pb-4 gap-x-2">
          <Button variant="indigo">
            <Link href="/login" className="">
              prihlasit Se
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="border-2 border-indigo-600 hv:border-indigo-500 transition-all"
          >
            <Link href="/register" className="text-indigo-600">
              Registrovat se
            </Link>
          </Button>
        </li>
      </ul>
    </div>
  );
}
