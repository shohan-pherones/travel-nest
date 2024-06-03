"use client";

import useBookRoom from "@/hooks/useBookRoom";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import RoomCard from "../room/RoomCard";
import { Elements } from "@stripe/react-stripe-js";
import RoomPaymentForm from "./RoomPaymentForm";
import { useState } from "react";
import { useTheme } from "next-themes";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const BookRoomClient = () => {
  const { bookedRoomData, clientSecret } = useBookRoom();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const { theme } = useTheme();

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: theme === "dark" ? "night" : "stripe",
      labels: "floating",
    },
  };

  const handlePaymentSuccess = (value: boolean) => {
    setPaymentSuccess(value);
  };

  return (
    <div className="max-w-[700px] mx-auto">
      {clientSecret && bookedRoomData && (
        <div>
          <h3 className="text-2xl font-semibold mb-5">
            Complete payment to reserve this room
          </h3>
          <div className="mb-5">
            <RoomCard room={bookedRoomData.room} />
          </div>
          <Elements stripe={stripePromise}>
            <RoomPaymentForm
              clientSecret={clientSecret}
              handlePaymentSuccess={handlePaymentSuccess}
            />
          </Elements>
        </div>
      )}
    </div>
  );
};

export default BookRoomClient;
