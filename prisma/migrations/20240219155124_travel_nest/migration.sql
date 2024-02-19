-- CreateTable
CREATE TABLE "Hotel" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "locationDescription" TEXT NOT NULL,
    "gym" BOOLEAN NOT NULL DEFAULT false,
    "spa" BOOLEAN NOT NULL DEFAULT false,
    "bar" BOOLEAN NOT NULL DEFAULT false,
    "laundry" BOOLEAN NOT NULL DEFAULT false,
    "restaurant" BOOLEAN NOT NULL DEFAULT false,
    "swimming_pool" BOOLEAN NOT NULL DEFAULT false,
    "cineplex" BOOLEAN NOT NULL DEFAULT false,
    "free_wifi" BOOLEAN NOT NULL DEFAULT false,
    "sports_zone" BOOLEAN NOT NULL DEFAULT false,
    "medical_service" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "bed_count" INTEGER NOT NULL DEFAULT 0,
    "guest_count" INTEGER NOT NULL DEFAULT 0,
    "bathroom_count" INTEGER NOT NULL DEFAULT 0,
    "master_bed" INTEGER NOT NULL DEFAULT 0,
    "queen_bed" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT NOT NULL,
    "room_price" INTEGER NOT NULL,
    "breakfast_price" INTEGER NOT NULL,
    "tv" BOOLEAN NOT NULL DEFAULT false,
    "air_condition" BOOLEAN NOT NULL DEFAULT false,
    "fridge" BOOLEAN NOT NULL DEFAULT false,
    "balcony" BOOLEAN NOT NULL DEFAULT false,
    "ocean_view" BOOLEAN NOT NULL DEFAULT false,
    "forest_view" BOOLEAN NOT NULL DEFAULT false,
    "mountain_view" BOOLEAN NOT NULL DEFAULT false,
    "free_wifi" BOOLEAN NOT NULL DEFAULT false,
    "sound_proof" BOOLEAN NOT NULL DEFAULT false,
    "room_service" BOOLEAN NOT NULL DEFAULT false,
    "hotelId" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "hotel_owner_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "breakfast_facility" BOOLEAN NOT NULL DEFAULT false,
    "currency" TEXT NOT NULL,
    "total_price" INTEGER NOT NULL,
    "payment_status" BOOLEAN NOT NULL DEFAULT false,
    "payment_intent_id" TEXT NOT NULL,
    "bookedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Booking_payment_intent_id_key" ON "Booking"("payment_intent_id");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
