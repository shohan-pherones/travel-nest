"use client";

import { Booking, Hotel, Room } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
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
  Waves,
  Wifi,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import AddRoomForm from "./AddRoomForm";

interface RoomCardProps {
  hotel?: Hotel & {
    rooms: Room[];
  };
  room: Room;
  bookings?: Booking[];
}

const RoomCard = ({ hotel, room, bookings = [] }: RoomCardProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const pathname = usePathname();
  const isHotelDetailsPage = pathname.includes("hotel-details");

  const handleRoomDelete = (room: Room) => {
    setIsLoading(true);
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
      <CardFooter>
        {isHotelDetailsPage ? (
          <div>Hotel Details Page</div>
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
    </Card>
  );
};

export default RoomCard;
