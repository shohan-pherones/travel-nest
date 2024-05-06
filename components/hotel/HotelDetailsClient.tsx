"use client";

import { useLocation } from "@/hooks/useLocation";
import { Booking } from "@prisma/client";
import {
  Bath,
  Dumbbell,
  Forklift,
  MapPin,
  Play,
  Syringe,
  Theater,
  WashingMachine,
  Waves,
  Wifi,
  Wine,
} from "lucide-react";
import Image from "next/image";
import { HotelWithRooms } from "./AddHotelForm";
import RoomCard from "../room/RoomCard";

const HotelDetailsClient = ({
  hotel,
  bookings,
}: {
  hotel: HotelWithRooms;
  bookings?: Booking[];
}) => {
  const { getCountryByCode, getStateByCode } = useLocation();
  const country = getCountryByCode(hotel.country);
  const state = getStateByCode(hotel.country, hotel.state);

  return (
    <div className="flex flex-col gap-5 pb-2">
      <div className="aspect-square overflow-hidden relative w-full h-[200px] md:h-[400px] rounded-lg">
        <Image
          fill
          src={hotel.image}
          alt={hotel.title}
          className="object-cover"
        />
      </div>
      <div>
        <h3 className="font-semibold text-xl md:text-3xl">{hotel.title}</h3>
        <div className="font-semibold mt-4">
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>
              {state?.name}
              {state?.name && ", "}
              {hotel.city}
              {hotel.city && ", "}
              {country?.name}
            </span>
          </span>
        </div>
        <h3 className="font-semibold text-lg mt-4 mb-2">Location Details</h3>
        <p className="text-primary/90 mb-2">{hotel.locationDescription}</p>
        <h3 className="font-semibold text-lg mt-4 mb-2">About this hotel</h3>
        <p className="text-primary/90 mb-2">{hotel.description}</p>
        <h3 className="font-semibold text-lg mt-4 mb-2">Popular Facilities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 content-start text-sm">
          {hotel.gym && (
            <span className="flex items-center gap-2">
              <Dumbbell className="h-4 w-4" />
              Gym
            </span>
          )}
          {hotel.swimming_pool && (
            <span className="flex items-center gap-2">
              <Waves className="h-4 w-4" />
              Swimming Pool
            </span>
          )}
          {hotel.sports_zone && (
            <span className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Sports Zone
            </span>
          )}
          {hotel.medical_service && (
            <span className="flex items-center gap-2">
              <Syringe className="h-4 w-4" />
              Medical Service
            </span>
          )}
          {hotel.spa && (
            <span className="flex items-center gap-2">
              <Bath className="h-4 w-4" />
              Spa
            </span>
          )}
          {hotel.bar && (
            <span className="flex items-center gap-2">
              <Wine className="h-4 w-4" />
              Bar
            </span>
          )}
          {hotel.laundry && (
            <span className="flex items-center gap-2">
              <WashingMachine className="h-4 w-4" />
              Laundry
            </span>
          )}
          {hotel.restaurant && (
            <span className="flex items-center gap-2">
              <Forklift className="h-4 w-4" />
              Restaurant
            </span>
          )}
          {hotel.cineplex && (
            <span className="flex items-center gap-2">
              <Theater className="h-4 w-4" />
              Cineplex
            </span>
          )}
          {hotel.free_wifi && (
            <span className="flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              Free Wi-Fi
            </span>
          )}
        </div>
      </div>
      <div>
        {!!hotel.rooms.length && (
          <div>
            <h3 className="font-semibold text-lg mt-4 mb-2">Hotel Rooms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {hotel.rooms.map((room) => (
                <RoomCard
                  room={room}
                  bookings={bookings}
                  hotel={hotel}
                  key={room.id}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelDetailsClient;
