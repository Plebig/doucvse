import React, { useEffect, useState, useCallback } from "react";
import { ChatMessage } from "@/lib/validations/message";
import { cn, toPusherKey } from "@/lib/utils";
import { format } from "date-fns";
import Button from "./ui/Button";
import Image from "next/image";
import EmbeddedCheckoutButton from "./EmbeddedCheckoutButton";
import { pusherClient } from "@/lib/pusher";
import AcceptRequestButtonComponent from "./AcceptRequestButton";
import Link from "next/link";
import { useSession } from "next-auth/react";
interface Props {
  message: ChatMessage;
  isCurrentUser: boolean;
  hasNextMessageFromSameUser: boolean;
}

interface FormatDate {
  (date: Date): string;
}


const InChatOffer = ({
  message,
  isCurrentUser,
  hasNextMessageFromSameUser,
}: Props) => {
  const [teacher, setTeacher] = useState<any>(null);
  const [tooOld, setTooOld] = useState<boolean>(false);
  const [paid, setPaid] = useState<boolean>(
    "isPaid" in message ? message.isPaid : true
  );

  const messageType = "type" in message ? message.type : "";

  const formatDate: FormatDate = useCallback((date) => {
    const day = String(date.getDate()).padStart(2, "0"); // Day with leading zero
    const month = date.toLocaleString("cs-CZ", { month: "short" }); // Short month name
    const year = date.getFullYear(); // Full year
    const hours = String(date.getHours()).padStart(2, "0"); // Hours with leading zero
    const minutes = String(date.getMinutes()).padStart(2, "0"); // Minutes with leading zero

    // Combine into desired format
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  }, []);

  const isWithinLast48Hours = useCallback((timestamp: number) => {
    const now = Date.now(); // Current time in milliseconds
    const fortyEightHoursInMs = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
    return now - timestamp <= fortyEightHoursInMs;
  }, []);

const fetchTeacherData = useCallback(async () => {
  if ('teacherId' in message && message.teacherId) {
    try {
      if (!teacher || teacher.id !== message.teacherId) {
        const response = await fetch("/api/get-teacher", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ teacherId: message.teacherId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch teacher");
        }

        const data = await response.json();

        if (!teacher || teacher.id !== data.id) {
          setTeacher(data);
        }
      }
    } catch (error) {
      console.error("Error fetching teacher data:", error);
    }
  }
}, ['teacherId' in message ? message.teacherId : undefined, teacher]);

  useEffect(() => {
    setTooOld(!isWithinLast48Hours(message.timeStamp));
    fetchTeacherData();
  }, [message, isWithinLast48Hours, fetchTeacherData]);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`lessonPurchased:${message.id}`));

    const handleLessonPurchased = () => {
      setPaid(true);
    };

    pusherClient.bind("lesson-purchased", handleLessonPurchased);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`lessonPurchased:${message.id}`));
      pusherClient.unbind("lesson-purchased", handleLessonPurchased);
    };
  }, [message.id]);

  return (
    <div className="" key={`${message.id}-${message.timeStamp}`}>
      <div
        className={cn("flex items-end", {
          "justify-end ": isCurrentUser,
        })}
      >
        <div
          className={cn("flex flex-col space-y-2 text-base max-w-xs mx-2", {
            "order-1 items-end": isCurrentUser,
            "order-2": !isCurrentUser,
          })}
        >
          <span
            className={cn("px-4 py-2 rounded-lg inline-block", {
              "bg-indigo-600 text-white": isCurrentUser,
              "bg-gray-200 text-gray-900": !isCurrentUser,
              "rounded-br-none": !hasNextMessageFromSameUser && isCurrentUser,
              "rounded-bl-none": !hasNextMessageFromSameUser && !isCurrentUser,
            })}
          >
            <div className="relative w-6 h-6 rounded-full">
              {messageType != "request" ? (
                <Link href={`/dashboard/teacherProfile/${teacher?.id}`}>
                  <Image
                    alt="profile picture"
                    src={teacher?.image}
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    fill
                  />
                </Link>
              ) : (
                <Image
                  alt="profile picture"
                  src={teacher?.image}
                  referrerPolicy="no-referrer"
                  className="rounded-full"
                  fill
                />
              )}
            </div>
            {"date" in message && (
              <div>Date: {format(message.date, "dd.MM.yyyy")}</div>
            )}
            {"timeSlot" in message && <div>Time Slot: {message.timeSlot}</div>}
            {"sessionLength" in message && (
              <div>minuty: {message.sessionLength}</div>
            )}
            {"hourlyCost" in message && (
              <div>
                price:{" "}
                {Math.round((message.hourlyCost * message.sessionLength) / 60)}{" "}
                CZK
              </div>
            )}
            {"teacherId" in message && (
              <div>Teacher Type: {message.teacherId}</div>
            )}
            <p>message type: {messageType}</p>
            <p>session length: </p>
            {"hourlyCost" in message && "sessionLength" in message && (
              <div className="py-2">
                {paid && messageType != "request" ? (
                  <Button disabled={true}>Zaplaceno</Button>
                ) : tooOld ? (
                  <Button disabled>Nabídka expirovala</Button>
                ) : messageType == "request" || messageType == "offer" ? (
                  <AcceptRequestButtonComponent
                    request={message}
                  ></AcceptRequestButtonComponent>
                ) : (

                  <EmbeddedCheckoutButton
                    ammount={Math.round(
                      message.hourlyCost * message.sessionLength * 100 / 60
                    )}
                    productName="hodina"
                    offerId={message.id}
                    teacherId={message.teacherId}
                    hourlyRate={message.hourlyCost}
                    sessionLength={message.sessionLength}
                    dateOfLesson={message.date}
                    subject={message.subject}
                    timeSlot={message.timeSlot}
                  />
                )}
              </div>
            )}
            <span className="ml-2 text-xs text-gray-400">
              {formatDate(new Date(message.timeStamp))}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default InChatOffer;
