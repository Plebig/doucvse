import { ChatMessage } from "@/lib/validations/message";
import Button from "./ui/Button";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { customAlphabet } from "nanoid";
import { fetchRedis } from "@/helpers/redis";

interface Props {
  request: ChatMessage;
}

const AcceptRequestButtonComponent = ({ request }: Props) => {
  const requestId = "id" in request ? request.id : "";
  const senderId = "senderId" in request ? request.senderId : "";
  const teacherId = "teacherId" in request ? request.teacherId : "";
  const studentId = "studentId" in request ? request.studentId : "";
  const timeSlot = "timeSlot" in request ? request.timeSlot : "";
  const date = "date" in request ? request.date : 0;

  const hours = "hours" in request ? request.hours : "";
  const hourlyCost = "hourlyCost" in request ? request.hourlyCost : 0;
  const subject = "subject" in request ? request.subject : "";
  const [isDone, setIsDone] = useState<boolean>(
    "isPaid" in request ? request.isPaid : false
  );

  const sessionLength = "sessionLength" in request ? request.sessionLength : 0;

  const { data: session } = useSession();

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`requestAccepted:${requestId}`));
    const handleRequestAccepted = () => {
      setIsDone(true);
    };
    pusherClient.bind("request-accepted", handleRequestAccepted);
    return () => {
      pusherClient.unbind("request-accepted", handleRequestAccepted);
      pusherClient.unsubscribe(`requestAccepted:${requestId}`);
    };
  }, [requestId, isDone]);

  const createNewLesson = async () => {
    if (hourlyCost != 0 && date != 0) {
      const alphabet =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      const customNanoid = customAlphabet(alphabet, 21);

      const lesson: Lesson = {
        id: customNanoid(),
        teacherId: teacherId,
        studentId: studentId,
        dateOfLesson: date,
        dateOfPurchase: new Date().getTime(),
        subject: subject,
        hourlyRate: hourlyCost,
        timeSlot: timeSlot,
        sessionLength: sessionLength,
      };
      const response = await fetch("/api/create-lesson", {
        method: "POST",
        body: JSON.stringify({
          lesson: lesson,
          requestId: requestId,
        }),
      });

      const responseEmail = await fetch("/api/email/send-emails-new-lesson", {
        method: "POST",
        body: JSON.stringify({
          lesson: lesson,
          requestId: requestId,
        }),
      });

      if (response.ok) {
        toast.success("nabídku potvrzena");
      } else {
        toast.error("něco se pokazilo");
      }
    }
  };

  const acceptRequest = async () => {
    try {
      // pošle novou nabídku
      await createNewLesson();
    } catch (error) {
      toast.error("něco se pokazilo");
    }

    try {
      const response = await fetch("/api/message/update-request", {
        method: "POST",
        body: JSON.stringify({
          id: requestId,
          teacherId: teacherId,
          studentId: studentId,
        }),
      });
    } catch (error) {
      toast.error("něco se pokazilo");
    }
  };

  if (!session) {
    return null;
  }
  return (
    <div>
      {isDone ? (
        <Button variant="default" disabled>
          nabídka potvrzena
        </Button>
      ) : senderId !== session.user.id ? (
        <Button variant="indigo" onClick={acceptRequest}>
          Accept Request
        </Button>
      ) : (
        <Button variant="default" disabled>
          čeká na potvrzení
        </Button>
      )}
    </div>
  );
};

export default AcceptRequestButtonComponent;
