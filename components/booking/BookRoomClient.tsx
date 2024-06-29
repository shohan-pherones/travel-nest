"use client";

import useBookRoom from "@/hooks/useBookRoom";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import RoomCard from "../room/RoomCard";
import { Elements } from "@stripe/react-stripe-js";
import RoomPaymentForm from "./RoomPaymentForm";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const BookRoomClient = () => {
  const { bookedRoomData, clientSecret } = useBookRoom();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    setPageLoaded(true);
  }, []);

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

  if (pageLoaded && !paymentSuccess && (!bookedRoomData || !clientSecret)) {
    return (
      <div className="flex flex-col items-center gap-5">
        <p className="text-rose-500 text-center">
          Oops! This page is not properly loaded...
        </p>
        <div className="flex items-center gap-5">
          <Button onClick={() => router.push("/")} variant={"outline"}>
            Go to Home
          </Button>
          <Button onClick={() => router.push("/my-bookings")}>
            View Bookings
          </Button>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="flex flex-col items-center gap-5">
        <p className="text-teal-500 text-center">Payment Success</p>
        <Button onClick={() => router.push("/my-bookings")}>
          View Bookings
        </Button>
      </div>
    );
  }

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
          <Elements stripe={stripePromise} options={options}>
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
