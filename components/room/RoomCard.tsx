"use client";

import { Booking, Hotel, Room } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import {
  Bath,
  Bed,
  BedDouble,
  Home,
  Tv,
  Users,
  UtensilsCrossed,
  Wifi,
} from "lucide-react";

interface RoomCardProps {
  hotel?: Hotel & {
    rooms: Room[];
  };
  room: Room;
  bookings?: Booking[];
}

const RoomCard = ({ hotel, room, bookings = [] }: RoomCardProps) => {
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
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
