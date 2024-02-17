"use client";

import { BookOpenCheck, ChevronsUpDown, Hotel, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function NavMenu() {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <ChevronsUpDown />
          <span className="sr-only">Nav menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => router.push("/hotel/new")}
          className="flex items-center gap-2"
        >
          <Plus size={16} /> <span>Add Hotel</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/my-hotels")}
          className="flex items-center gap-2"
        >
          <Hotel size={16} /> <span>My Hotels</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/my-bookings")}
          className="flex items-center gap-2"
        >
          <BookOpenCheck size={16} /> <span>My Bookings</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
