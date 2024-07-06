"use client";

import useBookRoom from "@/hooks/useBookRoom";
import { useLocation } from "@/hooks/useLocation";
import { useAuth } from "@clerk/nextjs";
import { Booking, Hotel, Room } from "@prisma/client";
import { differenceInCalendarDays } from "date-fns";
import {
  Bath,
  Bed,
  BedDouble,
  Fan,
  Home,
  MapPin,
  MicOff,
  Mountain,
  Refrigerator,
  Trees,
  Tv,
  Users,
  UtensilsCrossed,
  Waves,
  Wifi,
} from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { useToast } from "../ui/use-toast";

interface MyBookingsClientProps {
  booking: Booking & { room: Room | null } & { hotel: Hotel | null };
}

const MyBookingsClient: React.FC<MyBookingsClientProps> = ({ booking }) => {
  const { setRoomData, paymentIntentId, setClientSecret, setPaymentIntentId } =
    useBookRoom();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  const { userId } = useAuth();
  const router = useRouter();
  const { getCountryByCode, getStateByCode } = useLocation();

  const { hotel: Hotel, room: Room } = booking;

  const { toast } = useToast();

  if (!Hotel || !Room) {
    return <div>Missing data...</div>;
  }

  const country = getCountryByCode(Hotel.country);
  const state = getStateByCode(Hotel.country, Hotel.state);

  const startDate = moment(booking.start_date).format("MMM Do YYYY");
  const endDate = moment(booking.end_date).format("MMM Do YYYY");
  const dayCount = differenceInCalendarDays(
    booking.end_date,
    booking.start_date
  );

  const handleBookRoom = () => {
    if (!userId) {
      return toast({
        variant: "destructive",
        description: "You need to log in!",
      });
    }

    if (!Hotel?.userId) {
      return toast({
        variant: "destructive",
        description: "Something went wrong!",
      });
    }

    setIsBookingLoading(true);

    const bookingRoomData = {
      room: Room,
      totalPrice: booking.total_price,
      breakfastIncluded: booking.breakfast_facility,
      startDate: booking.start_date,
      endDate: booking.end_date,
    };

    setRoomData(bookingRoomData);

    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        booking: {
          hotel_owner_id: Hotel.userId,
          hotelId: Hotel.id,
          roomId: Room.id,
          start_date: booking.start_date,
          end_date: booking.end_date,
          breakfast_facility: booking.breakfast_facility,
          total_price: booking.total_price,
        },
        payment_intent_id: paymentIntentId,
      }),
    })
      .then((res) => {
        setIsBookingLoading(false);

        if (res.status === 401) {
          return router.push("/login");
        }

        return res.json();
      })
      .then((data) => {
        setClientSecret(data.paymentIntent.client_secret);
        setPaymentIntentId(data.paymentIntent.id);
        router.push("/book-room");
      })
      .catch((error: any) => {
        toast({
          variant: "destructive",
          description: error.message,
        });
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{Hotel.title}</CardTitle>
        <CardDescription>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>
              {Hotel.city}
              {Hotel.city && ", "}
              {country?.name}
            </span>
          </div>
          <div className="text-primary/50 py-2">
            {Hotel.description.substring(0, 50)}...
          </div>
        </CardDescription>
        <CardTitle className="text-lg">{Room.title}</CardTitle>
        <CardDescription>
          {Room.description.substring(0, 50)}...
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="aspect-square overflow-hidden h-[200px] relative rounded-lg">
          <Image src={Room.image} fill alt={Room.title} />
        </div>
        <div className="grid grid-cols-2 gap-5 content-start text-sm">
          <span className="flex items-center gap-2">
            <Bed className="h-4 w-4" />
            {Room.bed_count} Bed{"(s)"}
          </span>
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {Room.guest_count} Guest{"(s)"}
          </span>
          <span className="flex items-center gap-2">
            <Bath className="h-4 w-4" />
            {Room.bathroom_count} Bathroom{"(s)"}
          </span>
          {!!Room.king_bed && (
            <span className="flex items-center gap-2">
              <BedDouble className="h-4 w-4" />
              {Room.king_bed} King Bed{"(s)"}
            </span>
          )}
          {!!Room.queen_bed && (
            <span className="flex items-center gap-2">
              <Bed className="h-4 w-4" />
              {Room.queen_bed} Queen Bed{"(s)"}
            </span>
          )}
          {Room.room_service && (
            <span className="flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              Room Service
            </span>
          )}
          {Room.tv && (
            <span className="flex items-center gap-2">
              <Tv className="h-4 w-4" />
              TV
            </span>
          )}
          {Room.balcony && (
            <span className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Balcony
            </span>
          )}
          {Room.free_wifi && (
            <span className="flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              Free Wi-Fi
            </span>
          )}
          {Room.air_condition && (
            <span className="flex items-center gap-2">
              <Fan className="h-4 w-4" />
              Air Condition
            </span>
          )}
          {Room.fridge && (
            <span className="flex items-center gap-2">
              <Refrigerator className="h-4 w-4" />
              Fridge
            </span>
          )}
          {Room.ocean_view && (
            <span className="flex items-center gap-2">
              <Waves className="h-4 w-4" />
              Ocean View
            </span>
          )}
          {Room.forest_view && (
            <span className="flex items-center gap-2">
              <Trees className="h-4 w-4" />
              Forest View
            </span>
          )}
          {Room.mountain_view && (
            <span className="flex items-center gap-2">
              <Mountain className="h-4 w-4" />
              Mountain View
            </span>
          )}
          {Room.sound_proof && (
            <span className="flex items-center gap-2">
              <MicOff className="h-4 w-4" />
              Soundproofed
            </span>
          )}
        </div>
        <Separator />
        <div className="flex gap-5 justify-between">
          <div>
            Room Price: <span className="font-bold">${Room.room_price}</span>
            <span className="text-xs"> /24hrs</span>
          </div>
          {!!Room.breakfast_price && (
            <div>
              Breakfast Price:{" "}
              <span className="font-bold">${Room.breakfast_price}</span>
            </div>
          )}
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <CardTitle className="text-lg">Booking Details</CardTitle>
          <div className="text-primary/50">
            <p>
              Room booked by {booking.user_name} for {dayCount} days -{" "}
              {moment(booking.bookedAt).fromNow()}
            </p>
            <p>Check-in: {startDate} at 12PM</p>
            <p>Check-out: {endDate} at 12PM</p>
            {booking.breakfast_facility && (
              <p>Breakfast will be served at 8AM</p>
            )}
            {booking.payment_status ? (
              <p className="text-teal-500">
                Paid ${booking.total_price} - Room reserved
              </p>
            ) : (
              <p className="text-rose-500">
                Unpaid ${booking.total_price} - Room not reserved
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Button
          disabled={isBookingLoading}
          variant="outline"
          onClick={() => router.push(`/hotel-details/${Hotel.id}`)}
        >
          View Hotel
        </Button>
        {!booking.payment_status && booking.userId === userId && (
          <Button disabled={isBookingLoading} onClick={() => handleBookRoom()}>
            {isBookingLoading ? "Processing..." : "Pay Now"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MyBookingsClient;
