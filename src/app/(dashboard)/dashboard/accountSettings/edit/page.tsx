import TeacherInformationSettingForm from "@/components/TeacherInformationSettingForm";
import UserInformationSettingForm from "@/components/UserInformationSettingForm";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

const UserEditPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const userInformationRaw = await fetchRedis(
    "get",
    `user:${session.user.id}:information`
  );
  const userInformation = JSON.parse(userInformationRaw);

  return (
    <>
      <div className="flex flex-col">
        {session.user.role === "teacher" ? (
          <TeacherInformationSettingForm
            session={session}
            userInformation={userInformation}
          />
        ) : null}
        <UserInformationSettingForm session={session} />
      </div>
    </>
  );
};

export default UserEditPage;
