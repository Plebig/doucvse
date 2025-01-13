import Stripe from "stripe";
import { stripe } from "@/utils/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/dbR";
import { customAlphabet } from "nanoid";
import { pusherServer } from "@/lib/pusher";
import { chatHrefConstructor, toPusherKey } from "@/lib/utils";
import { fetchRedis } from "@/helpers/redis";


export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  try {
    if (event.type === "checkout.session.completed") {
      // Retrieve the line items from the session
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      // Fetch product details for each line item
      for (const item of lineItems.data) {
        if (item.price) {
          const product = await stripe.products.retrieve(
            item.price.product as string
          );

          const alphabet =
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
          const customNanoid = customAlphabet(alphabet, 21);

          const offerId = product.metadata?.offerId as string;
          const teacherId = product.metadata?.teacherId as string;
          const studentId = session.metadata?.userId as string;
          const dateOfLesson = parseInt(
            product.metadata?.dateOfLesson as string,
            10
          );
          const subject = product.metadata?.subject as string;
          const hourlyRate = parseFloat(product.metadata?.hourlyRate as string);
          const timeSlot = product.metadata?.timeSlot as string;
          const sessionLength = parseInt(
            product.metadata?.sessionLength as string,
            10
          );

          const lesson: Lesson = {
            id: customNanoid(),
            teacherId: teacherId,
            studentId: studentId,
            dateOfLesson: dateOfLesson,
            dateOfPurchase: new Date().getTime(),
            subject: subject,
            hourlyRate: hourlyRate,
            timeSlot: timeSlot,
            sessionLength: sessionLength,
          };

          await db.zadd(
            `user:${product.metadata?.teacherId as string}:lessons`,
            {
              score: dateOfLesson,
              member: JSON.stringify(lesson),
            }
          );

          await db.zadd(`user:${studentId}:lessons`, {
            score: dateOfLesson,
            member: JSON.stringify(lesson),
          });

          await pusherServer.trigger(
            toPusherKey(`lessonPurchased:${offerId}`),
            "lesson-purchased",
            lesson
          );

          const messages = await fetchRedis(
            "zrange",
            `chat:${chatHrefConstructor(teacherId, studentId)}:messages`,
            0,
            -1
          );
          const message = messages.find(
            (msg: string) => JSON.parse(msg).id === offerId
          );
          if (message) {
            const parsedMessage = JSON.parse(message);
            parsedMessage.isPaid = true;

            await db.zrem(
              `chat:${chatHrefConstructor(teacherId, studentId)}:messages`,
              message
            );
            await db.zadd(
              `chat:${chatHrefConstructor(teacherId, studentId)}:messages`,
              {
                score: parsedMessage.timeStamp,
                member: JSON.stringify(parsedMessage),
              }
            );

            try {
              const rawTeacher = await fetchRedis("get", `user:${teacherId}`);
              const rawStudent = await fetchRedis("get", `user:${studentId}`);
              const teacherEmail = JSON.parse(rawTeacher).email;
              const studentEmail = JSON.parse(rawStudent).email;

              const emailToTeacher: emailInfo = {
                to: teacherEmail,
                subject: "Nové doučování",
                text: "Bude doucko",
                html: "<b>Bude doučko konecne</b>",
              };

              const emailToStudent: emailInfo = {
                to: studentEmail,
                subject: "zarezervovali jste jsi Nové doučování",
                text: "Bude doucko",
                html: "<b>Bude doučko konecne</b>",
              };

              const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

              await fetch(`${baseUrl}/api/send-email`, {
                method: "POST",
                body: JSON.stringify(emailToTeacher),
              });

              await fetch(`${baseUrl}/api/send-email`, {
                method: "POST",
                body: JSON.stringify(emailToStudent),
              });
            } catch (error) {
              console.log("Error sending email: ", error);
            }

            console.log("Message updated successfully");
          } else {
            console.warn("Message not found for offerId: ", offerId);
          }
        } else {
          console.warn(
            "Item price is null for item: ",
            JSON.stringify(item, null, 2)
          );
        }
      }
    }
    return new Response("ok", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("internal server error", { status: 500 });
  }
}
