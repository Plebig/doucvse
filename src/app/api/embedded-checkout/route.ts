import { NextResponse } from "next/server";
import { stripe } from "@/utils/stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const {
      ammount,
      offerId,
      productName,
      teacherId,
      dateOfLesson,
      hourlyRate,
      subject,
      timeSlot,
      sessionLength,
    } = await req.json();
    const userSession = await getServerSession(authOptions);
    const product = await stripe.products.create({
      name: productName,
      description: "Product description",
      metadata: {
        offerId: offerId,
        teacherId: teacherId,
        userId: userSession?.user?.id,
        dateOfLesson: dateOfLesson,
        hourlyRate: hourlyRate,
        subject: subject,
        timeSlot: timeSlot,
        sessionLength: sessionLength,
      },
    });

    const price = await stripe.prices.create({
      unit_amount: ammount,
      currency: "czk",
      product: product.id,
    });

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      metadata: {
        userId: userSession?.user?.id,
        teacherId: teacherId,
        // kdy to bude
        // kdy se to koupilo
        // cena za h
        // delka
      },
      return_url: `${req.headers.get(
        "origin"
      )}/return?session_id={CHECKOUT_SESSION_ID}`,
    });
    return NextResponse.json({
      id: session.id,
      client_secret: session.client_secret,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
