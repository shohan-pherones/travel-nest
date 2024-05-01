"use client";

import { useLocation } from "@/hooks/useLocation";
import { cn } from "@/lib/utils";
import { Dumbbell, MapPin, Play, Syringe, Waves } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { HotelWithRooms } from "./AddHotelForm";

interface Props {
  hotel: HotelWithRooms;
}

const HotelCard = ({ hotel }: Props) => {
  const pathname = usePathname();
  const isMyHotels = pathname.includes("my-hotels");
  const router = useRouter();

  const { getCountryByCode } = useLocation();
  const country = getCountryByCode(hotel.country);

  return (
    <div
      onClick={() => !isMyHotels && router.push(`/hotel-details/${hotel.id}`)}
      className={cn(
        "col-span-1 cursor-pointer transition hover:scale-105",
        isMyHotels && "cursor-default"
      )}
    >
      <div className="flex flex-col gap-2 bg-background/50 border border-primary/10 rounded-lg">
        <div className="overflow-hidden relative w-full h-[200px] rounded-t-lg">
          <Image
            fill
            src={hotel.image}
            alt={hotel.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between gap-2 px-5 py-3 text-sm">
          <div className="font-semibold text-xl">{hotel.title}</div>
          <div className="text-primary/90">
            {hotel.description.substring(0, 50)}...
          </div>
          <div className="text-primary/90">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>
                {hotel.city}
                {hotel.city && ", "}
                {country?.name}
              </span>
            </span>
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
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {hotel?.rooms[0]?.room_price && (
                <>
                  <div className="font-semibold text-xl">
                    ${hotel?.rooms[0]?.room_price}
                  </div>
                  <div className="text-xs">/ 24hrs</div>
                </>
              )}
            </div>
            {isMyHotels && (
              <Button
                onClick={() => router.push(`/hotel/${hotel.id}`)}
                variant="outline"
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
