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
          const lesson: Lesson = {
            id: customNanoid(),
            teacherId: product.metadata?.teacherId as string,
            studentId: session.metadata?.userId as string,
            dateOfLesson: parseInt(
              product.metadata?.dateOfLesson as string,
              10
            ),
            dateOfPurchase: new Date().getTime(),
            subject: product.metadata?.subject as string,
            hourlyRate: parseFloat(product.metadata?.hourlyRate as string),
            timeSlot: product.metadata?.timeSlot as string,
            sessionLength: parseInt(
              product.metadata?.sessionLength as string,
              10
            ),
          };

          
          await db.zadd(
            `user:${product.metadata?.teacherId as string}:lessons`,
            {
              score: parseInt(product.metadata?.dateOfLesson as string, 10),
              member: JSON.stringify(lesson),
            }
          );

          await db.zadd(
            `user:${product.metadata?.userId as string}:lessons`,
            {
              score: parseInt(product.metadata?.dateOfLesson as string, 10),
              member: JSON.stringify(lesson),
            }
          );

          pusherServer.trigger(
            toPusherKey(`lessonPurchased:${offerId}`),
            "lesson-purchased",
            lesson
          );

          const messages = await fetchRedis(
            "zrange",
            `chat:${chatHrefConstructor(
              product.metadata?.teacherId as string,
              product.metadata?.userId as string
            )}:messages`,
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
              `chat:${chatHrefConstructor(
                product.metadata?.teacherId as string,
                product.metadata?.userId as string
              )}:messages`,
              message
            );
            await db.zadd(
              `chat:${chatHrefConstructor(
                product.metadata?.teacherId as string,
                product.metadata?.userId as string
              )}:messages`,
              {
                score: parsedMessage.timeStamp,
                member: JSON.stringify(parsedMessage),
              }
            );

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
