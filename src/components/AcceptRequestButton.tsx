import { chatHrefConstructor } from "@/lib/utils";
import { ChatMessage } from "@/lib/validations/message";
import Button from "./ui/Button";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

interface Props {
  request: ChatMessage;
}

const AcceptRequestButtonComponent = ({ request }: Props) => {
  const requestId = "id" in request ? request.id : "";
  const senderId = "senderId" in request ? request.senderId : "";
  const teacherId = "teacherId" in request ? request.teacherId : "";
  const timeSlot = "timeSlot" in request ? request.timeSlot : "";
  const date = "date" in request ? request.date : "";
  const hours = "hours" in request ? request.hours : "";
  const hourlyCost = "hourlyCost" in request ? request.hourlyCost : "";
  const subject = "subject" in request ? request.subject : "";
  const [isDone, setIsDone] = useState<boolean>("isPaid" in request ? request.isPaid : false);
  const chatId = chatHrefConstructor(senderId, teacherId);

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
    }
  }, [requestId, isDone]);

  const acceptRequest = async () => {
    try {
      // pošle novou nabídku
      const response = await fetch("/api/message/send-offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: chatId,
          teacherId: teacherId,
          type: "offer",
          date: date,
          timeSlot: timeSlot,
          hours: hours,
          hourlyCost: hourlyCost,
          subject: subject,
        }),
      });
      if (response.ok) {
        toast.success("nabídka vytvořena");
      }
    } catch (error) {
      toast.error("něco se pokazilo");
    }

    try {
      const response = await fetch("/api/message/update-request", {
        method: "POST",
        body: JSON.stringify({
          id: requestId,
          teacherId: teacherId,
          studentId: senderId,
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
      ) : session.user.id === teacherId ? (
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
