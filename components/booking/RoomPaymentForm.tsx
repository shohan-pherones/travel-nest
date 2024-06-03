"use client";

import useBookRoom from "@/hooks/useBookRoom";
import {
  AddressElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";

interface Props {
  clientSecret: string;
  handlePaymentSuccess: (value: boolean) => void;
}

const RoomPaymentForm = ({ clientSecret, handlePaymentSuccess }: Props) => {
  const { bookedRoomData, resetBookRoom } = useBookRoom();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!stripe) {
      return;
    }

    if (!clientSecret) {
      return;
    }

    handlePaymentSuccess(false);
    setIsLoading(false);
  }, [stripe, clientSecret, handlePaymentSuccess]);

  const handleSubmit = () => {};

  return (
    <form onSubmit={handleSubmit} id="payment-form">
      <h2 className="font-semibold mb-2 text-lg">Billing Address</h2>
      <AddressElement
        options={{
          mode: "billing",
          allowedCountries: ["BD", "IN", "US", "GB"],
        }}
      />
    </form>
  );
};

export default RoomPaymentForm;
