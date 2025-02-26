"use client";
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useCallback, useRef, useState } from "react";
import Button from "./ui/Button";
import { useSession } from "next-auth/react";

interface Props {
  offerId: string;
  teacherId: string;
  ammount: number;
  hourlyRate: number;
  sessionLength: number;
  dateOfLesson: number;
  subject: string;
  productName: string;
  timeSlot: string;
}

const EmbeddedCheckoutButton = ({ offerId, ammount, productName, teacherId, dateOfLesson, hourlyRate, subject, sessionLength, timeSlot }: Props) => {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );
  const [showCheckout, setShowCheckout] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);

  const fetchClientSecret = useCallback(() => {
    return fetch("/api/embedded-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        offerId: offerId,
        ammount: ammount,
        productName: productName,
        teacherId: teacherId,
        dateOfLesson: dateOfLesson,
        hourlyRate: hourlyRate,
        subject: subject,
        timeSlot: timeSlot,
        sessionLength: sessionLength,
      }),
    })
      .then((res) => res.json())
      .then((data) => data.client_secret);
  }, []);

  const options = { fetchClientSecret };

  const handleCheckoutClick = () => {
    setShowCheckout(true);
    modalRef.current?.showModal();
  };

  const handleCloseModal = () => {
    setShowCheckout(false);
    modalRef.current?.close();
  };
  const { data: session } = useSession();

  if (!session) {
    return null;
  }
  
  return (
    <div id="checkout" className="my-4">
      {session.user?.id === teacherId ? (<Button variant="default" disabled={true}>čeká na zaplacení</Button>):(
      <Button variant="indigo" onClick={handleCheckoutClick} disabled={false}>
        Zaplatit uciteli
      </Button>)}
      <dialog ref={modalRef} className="modal">
        <div className="modal-box w-100 max-w-screen-2xl">
          <h3 className="font-bold text-lg">Embedded Checkout</h3>
          <div className="py-4">
            {showCheckout && (
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={options}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            )}
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn" onClick={handleCloseModal}>
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default EmbeddedCheckoutButton;
