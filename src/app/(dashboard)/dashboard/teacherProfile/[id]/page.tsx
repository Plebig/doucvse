import Calendar from "@/components/Calendar";
import FirstMessageButton from "@/components/FirstMessageButton";
import Subjects from "@/components/ui/Subjects";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import React from "react";
import Button from "@/components/ui/Button";
import Link from "next/link";


const TeacherProfilePage = async ({ params }: any) => {
  const teacherId = params.id;

  const session = await getServerSession(authOptions);

  const teacherRaw = await fetchRedis("get", `user:${teacherId}`);
  const teacher = JSON.parse(teacherRaw);
  const teacherInformationRaw = await fetchRedis(
    "get",
    `user:${teacherId}:information`
  );
  
  const teacherInformation = JSON.parse(teacherInformationRaw);
  const teacherProfile = {
    ...teacher,
    ...teacherInformation,
  };
  const teacherPrice = teacherInformation.price
  if (session) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Main Content */}
        <div className="flex flex-col md:flex-row">
          <div className="flex-col items-center md:items-start md:w-3/4">
            {/* Image and Name */}
            <div className="flex">
              <div className="flex flex-col items-center md:items-start mr-5">
                <div className="relative h-64 w-64 bg-gray-50 mr-2">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-lg"
                    src={teacher.image}
                    // src="/profilePictures/aiImage.webp"
                    alt="Your profile image"
                  />
                </div>
                <h2 className="text-2xl font-semibold mt-2 text-gray-800">
                  {teacher.name}
                </h2>
                <p className="text-yellow-500 flex flex-col items-center ">
                  <span className="text-2xl">
                    &#9733;&#9733;&#9733;&#9733;&#9733;
                  </span>
                  <span className=" text-gray-600">1000+ hodnocení</span>
                </p>
              </div>
              <div className="flex flex-col">
                <div className="relative w-[192px] h-[34px]">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-lg"
                    src="/facults/FPH.svg"
                    alt="Your profile image"
                  />
                </div>
                {/* Price */}
                <div className="mt-4">
                  <p className="text-3xl font-semibold text-gray-700 mb-4">
                    od {teacherProfile.price} Kč
                  </p>
                </div>

                {/* Subjects */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Subjects subjects={teacherProfile.subjects} />
                </div>

                {/* Meeting Info */}
                <div className="mt-4">
                  <h3 className="text-gray-700 font-semibold mb-2 text-2xl">
                    Kde se potkáme?
                  </h3>
                  <p className="text-gray-600 ">
                    Ideálně online, ale taky se můžeme potkat na koleji Blanice,
                    nebo třeba v hospodě. Záleží jak to komu vyhovuje.
                  </p>
                </div>
                <div className="mt-4">
                  <h3 className="text-gray-700 font-semibold mb-2">Bio:</h3>
                  <p className="text-gray-600">
                    {teacherProfile.userDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-4 flex gap-x-2">
              <FirstMessageButton
                senderId={session.user.id}
                teacherEmail={teacher.email}
                teacherId={teacherId}
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="md:w-1/2 flex flex-col justify-center items-center md:pl-6 mt-6 md:mt-0">
            <Calendar isAuth={true} teacherId={teacherId} sessionId={session.user.id} teacherPrice={teacherPrice}/>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Main Content */}
        <div className="flex flex-col md:flex-row">
          <div className="flex-col items-center md:items-start md:w-3/4">
            {/* Image and Name */}
            <div className="flex">
              <div className="flex flex-col items-center md:items-start mr-5">
                <div className="relative h-64 w-64 bg-gray-50 mr-2">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-lg"
                    src={teacher.image}
                    // src="/profilePictures/aiImage.webp"
                    alt="Your profile image"
                  />
                </div>
                <h2 className="text-2xl font-semibold mt-2 text-gray-800">
                  {teacher.name}
                </h2>
                <p className="text-yellow-500 flex flex-col items-center ">
                  <span className="text-2xl">
                    &#9733;&#9733;&#9733;&#9733;&#9733;
                  </span>
                  <span className=" text-gray-600">1000+ hodnocení</span>
                </p>
              </div>
              <div className="flex flex-col">
                <div className="relative w-[192px] h-[34px]">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-lg"
                    src="/facults/FPH.svg"
                    alt="Your profile image"
                  />
                </div>
                {/* Price */}
                <div className="mt-4">
                  <p className="text-3xl font-semibold text-gray-700 mb-4">
                    od {teacherProfile.price} Kč
                  </p>
                </div>

                {/* Subjects */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Subjects subjects={teacherProfile.subjects} />
                </div>

                {/* Meeting Info */}
                <div className="mt-4">
                  <h3 className="text-gray-700 font-semibold mb-2 text-2xl">
                    Kde se potkáme?
                  </h3>
                  <p className="text-gray-600 ">
                    Ideálně online, ale taky se můžeme potkat na koleji Blanice,
                    nebo třeba v hospodě. Záleží jak to komu vyhovuje.
                  </p>
                </div>
                <div className="mt-4">
                  <h3 className="text-gray-700 font-semibold mb-2">Bio:</h3>
                  <p className="text-gray-600">
                    {teacherProfile.userDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-4 flex gap-x-2">
              <Link href="/login">
                <Button variant="indigo">napsat zpravu</Button>
              </Link>
            </div>
          </div>

          {/* Right Section */}
          <div className="md:w-1/2 flex flex-col justify-center items-center md:pl-6 mt-6 md:mt-0">
            <Calendar isAuth={false} teacherId="" sessionId="" teacherPrice={0}/>
          </div>
        </div>
      </div>
    );
  }
};

export default TeacherProfilePage;
