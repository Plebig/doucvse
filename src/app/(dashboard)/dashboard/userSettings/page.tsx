import TeacherInformationSettingForm from "@/components/TeacherInformationSettingForm";
import UserInformationSettingForm from "@/components/UserInformationSettingForm";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";

const UserSettingsPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const userInformationRaw = await fetchRedis(
    "get",
    `user:${session.user.id}:information`
  );
  const userInformation = JSON.parse(userInformationRaw);

  return (
    <>
      <div className="flex">
        <div className="flex flex-col w-1/4 border-r-2 p-8">
          {/*user settings sidebar */}
          <Link href="/dashboard/accountSetting/general">
            Upravit profil
          </Link>
        </div>
        <div className="w-3/4">
          {session.user.role === "teacher" ? (
            <TeacherInformationSettingForm
              session={session}
              userInformation={userInformation}
            />
          ) : null}
          <UserInformationSettingForm session={session} />
        </div>
      </div>
    </>
  );
};

export default UserSettingsPage;
