import React, { useEffect, useState } from "react";
import { ChatMessage } from "@/lib/validations/message";
import { cn, toPusherKey } from "@/lib/utils";
import { format } from "date-fns";
import Button from "./ui/Button";
import { fetchRedis } from "@/helpers/redis";
import Image from "next/image";
import { EmbeddedCheckout } from "@stripe/react-stripe-js";
import EmbeddedCheckoutButton from "./EmbeddedCheckoutButton";
import { pusherClient } from "@/lib/pusher";

interface Props {
  message: ChatMessage;
  isCurrentUser: boolean;
  hasNextMessageFromSameUser: boolean;
}

const InChatOffer = async ({
  message,
  isCurrentUser,
  hasNextMessageFromSameUser,
}: Props) => {
  const [teacher, setTeacher] = useState<any>(null);
  const [tooOld, setTooOld] = useState<boolean>(false);
  const [paid, setPaid] = useState<boolean>(
    "isPaid" in message ? message.isPaid : false
  );
  const formaTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);

    // Format parts
    const day = String(date.getDate()).padStart(2, "0"); // Day with leading zero
    const month = date.toLocaleString("cs-CZ", { month: "short" }); // Short month name
    const year = date.getFullYear(); // Full year
    const hours = String(date.getHours()).padStart(2, "0"); // Hours with leading zero
    const minutes = String(date.getMinutes()).padStart(2, "0"); // Minutes with leading zero

    // Combine into desired format
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  };

  function isWithinLast48Hours(timestamp: number) {
    const now = Date.now(); // Current time in milliseconds
    const fortyEightHoursInMs = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
    return now - timestamp <= fortyEightHoursInMs;
  }

  const onSubmit = async () => {};

  useEffect(() => {
    console.log("message: ", message);  
    setTooOld(!isWithinLast48Hours(message.timeStamp));
    console.log("message id: ", message.id);
    const fetchTeacherData = async () => {
      if ("teacherId" in message) {
        try {
          const response = await fetch("/api/get-teacher", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ teacherId: message.teacherId }),
          });
          const data = await response.json();
          setTeacher(data);
        } catch (error) {
          console.error("Error fetching teacher data:", error);
        }
      }
    };

    pusherClient.subscribe(toPusherKey(`lessonPurchased:${message.id}`));

    const handleLessonPurchased = () => {
      console.log("lesson purchased");
      setPaid(true);
    };

    pusherClient.bind("lesson-purchased", handleLessonPurchased);

    fetchTeacherData();

    return () => {
      pusherClient.unsubscribe(`lessonPurchased:${message.id}`);
      pusherClient.unbind("lesson-purchased", handleLessonPurchased);
    };
  }, [message, paid]);

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
              <Image
                alt="profile picture"
                src={teacher?.image}
                referrerPolicy="no-referrer"
                className="rounded-full"
                fill
              />
            </div>
            {"date" in message && <div>Date: {message.date}</div>}
            {"timeSlot" in message && <div>Time Slot: {message.timeSlot}</div>}
            {"hours" in message && <div>Hours: {message.hours}</div>}
            {"hourlyCost" in message && (
              <div>
                price: {Math.round(message.hourlyCost * message.hours)} CZK
              </div>
            )}
            {"teacherId" in message && (
              <div>Teacher Type: {message.teacherId}</div>
            )}
            {"hourlyCost" in message && "hours" in message && (
              <div className="py-2">
                {paid ? (
                  <Button disabled={true}>Zaplaceno</Button>
                ) : tooOld ? (
                  <Button onClick={onSubmit} disabled>
                    Nabídka expirovala
                  </Button>
                ) : (
                  <EmbeddedCheckoutButton
                    ammount={Math.round(
                      message.hourlyCost * message.hours * 100
                    )}
                    productName="hodina"
                    offerId={message.id}
                    teacherId={message.teacherId}
                    hourlyRate={message.hourlyCost}
                    sessionLength={message.hours}
                    dateOfLesson={message.date}
                    subject={message.subject}
                    timeSlot={message.timeSlot}
                  />
                )}
              </div>
            )}
            <span className="ml-2 text-xs text-gray-400">
              {formaTimestamp(message.timeStamp)}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default InChatOffer;
