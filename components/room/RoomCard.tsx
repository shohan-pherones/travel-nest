"use client";

import useBookRoom from "@/hooks/useBookRoom";
import { useAuth } from "@clerk/nextjs";
import { Booking, Hotel, Room } from "@prisma/client";
import axios from "axios";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import {
  Bath,
  Bed,
  BedDouble,
  Fan,
  Home,
  Loader2,
  MicOff,
  Mountain,
  Refrigerator,
  Trash,
  Trees,
  Tv,
  Users,
  UtensilsCrossed,
  Wand2,
  Waves,
  Wifi,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { Button, buttonVariants } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { toast } from "../ui/use-toast";
import AddRoomForm from "./AddRoomForm";
import { DatePickerWithRange } from "./DateRangePicker";

interface RoomCardProps {
  hotel?: Hotel & {
    rooms: Room[];
  };
  room: Room;
  bookings?: Booking[];
}

const RoomCard = ({ hotel, room, bookings = [] }: RoomCardProps) => {
  const { setRoomData, paymentIntentId, setClientSecret, setPaymentIntentId } =
    useBookRoom();
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBookingLoading, setIsBookingLoading] = useState<boolean>(false);
  const [date, setDate] = useState<DateRange | undefined>();
  const [totalPrice, setTotalPrice] = useState(room.room_price);
  const [includeBreakfast, setIncludeBreakfast] = useState<boolean>(false);
  const [days, setDays] = useState<number>(1);

  const router = useRouter();
  const { userId } = useAuth();

  const pathname = usePathname();
  const isHotelDetailsPage = pathname.includes("hotel-details");
  const isBookRoom = pathname.includes("book-room");

  useEffect(() => {
    if (date && date.from && date.to) {
      const dayCount = differenceInCalendarDays(date.to, date.from);

      setDays(dayCount);

      if (dayCount && room.room_price) {
        if (includeBreakfast && room.breakfast_price) {
          setTotalPrice(
            dayCount * room.room_price + dayCount * room.breakfast_price
          );
        } else {
          setTotalPrice(dayCount * room.room_price);
        }
      } else {
        setTotalPrice(room.room_price);
      }
    }
  }, [date, room.room_price, includeBreakfast, room.breakfast_price]);

  const disabledDates = useMemo(() => {
    let dates: Date[] = [];

    const roomBookings = bookings.filter(
      (booking) => booking.roomId === room.id && booking.payment_status
    );

    roomBookings.forEach((booking) => {
      const range = eachDayOfInterval({
        start: new Date(booking.start_date),
        end: new Date(booking.end_date),
      });

      dates = [...dates, ...range];
    });

    return dates;
  }, [bookings, room.id]);

  const handleRoomDelete = (room: Room) => {
    setIsLoading(true);
    const imageKey = room.image.substring(room.image.lastIndexOf("/") + 1);

    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then(() => {
        axios
          .delete(`/api/room/${room.id}`)
          .then(() => {
            router.refresh();
            toast({
              description: "Room Deleted!",
            });
            setIsLoading(false);
          })
          .catch(() => {
            toast({
              variant: "destructive",
              description: "Something went wrong!",
            });
            setIsLoading(false);
          });
      })
      .catch(() => {
        toast({
          variant: "destructive",
          description: "Something went wrong!",
        });
        setIsLoading(false);
      });
  };

  const handleBookRoom = () => {
    if (!userId) {
      return toast({
        variant: "destructive",
        description: "You need to log in!",
      });
    }

    if (!hotel?.userId) {
      return toast({
        variant: "destructive",
        description: "Something went wrong!",
      });
    }

    if (date?.from && date?.to) {
      setIsBookingLoading(true);

      const bookingRoomData = {
        room,
        totalPrice,
        breakfastIncluded: includeBreakfast,
        startDate: date.from,
        endDate: date.to,
      };

      setRoomData(bookingRoomData);

      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          booking: {
            hotel_owner_id: hotel.userId,
            hotelId: hotel.id,
            roomId: room.id,
            start_date: date.from,
            end_date: date.to,
            breakfast_facility: includeBreakfast,
            total_price: totalPrice,
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
    } else {
      return toast({
        variant: "destructive",
        description: "Pick dates!",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{room.title}</CardTitle>
        <CardDescription>{room.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="aspect-square overflow-hidden h-[200px] relative rounded-lg">
          <Image src={room.image} fill alt={room.title} />
        </div>
        <div className="grid grid-cols-2 gap-5 content-start text-sm">
          <span className="flex items-center gap-2">
            <Bed className="h-4 w-4" />
            {room.bed_count} Bed{"(s)"}
          </span>
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {room.guest_count} Guest{"(s)"}
          </span>
          <span className="flex items-center gap-2">
            <Bath className="h-4 w-4" />
            {room.bathroom_count} Bathroom{"(s)"}
          </span>
          {!!room.king_bed && (
            <span className="flex items-center gap-2">
              <BedDouble className="h-4 w-4" />
              {room.king_bed} King Bed{"(s)"}
            </span>
          )}
          {!!room.queen_bed && (
            <span className="flex items-center gap-2">
              <Bed className="h-4 w-4" />
              {room.queen_bed} Queen Bed{"(s)"}
            </span>
          )}
          {room.room_service && (
            <span className="flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              Room Service
            </span>
          )}
          {room.tv && (
            <span className="flex items-center gap-2">
              <Tv className="h-4 w-4" />
              TV
            </span>
          )}
          {room.balcony && (
            <span className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Balcony
            </span>
          )}
          {room.free_wifi && (
            <span className="flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              Free Wi-Fi
            </span>
          )}
          {room.air_condition && (
            <span className="flex items-center gap-2">
              <Fan className="h-4 w-4" />
              Air Condition
            </span>
          )}
          {room.fridge && (
            <span className="flex items-center gap-2">
              <Refrigerator className="h-4 w-4" />
              Fridge
            </span>
          )}
          {room.ocean_view && (
            <span className="flex items-center gap-2">
              <Waves className="h-4 w-4" />
              Ocean View
            </span>
          )}
          {room.forest_view && (
            <span className="flex items-center gap-2">
              <Trees className="h-4 w-4" />
              Forest View
            </span>
          )}
          {room.mountain_view && (
            <span className="flex items-center gap-2">
              <Mountain className="h-4 w-4" />
              Mountain View
            </span>
          )}
          {room.sound_proof && (
            <span className="flex items-center gap-2">
              <MicOff className="h-4 w-4" />
              Soundproofed
            </span>
          )}
        </div>
        <Separator />
        <div className="flex gap-5 justify-between">
          <div>
            Room Price: <span className="font-bold">${room.room_price}</span>
            <span className="text-xs"> /24hrs</span>
          </div>
          {!!room.breakfast_price && (
            <div>
              Breakfast Price:{" "}
              <span className="font-bold">${room.breakfast_price}</span>
            </div>
          )}
        </div>
        <Separator />
      </CardContent>
      {!isBookRoom && (
        <CardFooter>
          {isHotelDetailsPage ? (
            <div className="flex flex-col gap-5">
              <div>
                <div className="mb-2">
                  Select days that you will spend in this room
                </div>
                <DatePickerWithRange
                  date={date}
                  setDate={setDate}
                  disabledDates={disabledDates}
                />
              </div>
              {room.breakfast_price > 0 && (
                <div>
                  <div className="mb-2">Do you want breakfast each day?</div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="breakfast"
                      onCheckedChange={(value) => setIncludeBreakfast(!!value)}
                    />
                    <label htmlFor="breakfast">Include Breakfast</label>
                  </div>
                </div>
              )}
              <div>
                Total Price: <span className="font-bold">${totalPrice}</span>{" "}
                for <span className="font-bold">{days} days</span>
              </div>
              <Button
                onClick={() => handleBookRoom()}
                disabled={isBookingLoading}
                type="button"
              >
                {isBookingLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                {isBookingLoading ? "Loading..." : "Book Room"}
              </Button>
            </div>
          ) : (
            <div className="flex w-full justify-between">
              <Button
                disabled={isLoading}
                type="button"
                variant="destructive"
                onClick={() => handleRoomDelete(room)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting
                  </>
                ) : (
                  <>
                    <Trash className="mr-2 h-4 w-4" /> Delete
                  </>
                )}
              </Button>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className={buttonVariants()}>
                  Update Room
                </DialogTrigger>
                <DialogContent className="max-w-5xl">
                  <DialogHeader>
                    <DialogTitle>Update Room</DialogTitle>
                    <DialogDescription>
                      Update room details carefully for your hotel.
                    </DialogDescription>
                  </DialogHeader>
                  <AddRoomForm
                    room={room}
                    hotel={hotel}
                    handleDialogueOpen={() => setOpen((prev) => !prev)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default RoomCard;
