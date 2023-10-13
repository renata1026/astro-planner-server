-- CreateEnum
CREATE TYPE "Location" AS ENUM ('NEW_YORK_CITY', 'LOS_ANGELES', 'CHICAGO', 'TORONTO');

-- CreateTable
CREATE TABLE "User" (
    "id" STRING NOT NULL,
    "firstName" STRING NOT NULL,
    "lastName" STRING NOT NULL,
    "email" STRING NOT NULL,
    "password" STRING NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "picture" STRING,
    "location" STRING,
    "dob" TIMESTAMP(3),
    "gender" STRING,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" STRING NOT NULL,
    "location" "Location" NOT NULL,
    "checkIn" TIMESTAMP(3) NOT NULL,
    "checkOut" TIMESTAMP(3) NOT NULL,
    "passengers" INT4 NOT NULL DEFAULT 1,
    "userId" STRING NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" STRING NOT NULL,
    "bookingConfirmation" STRING,
    "checkIn" STRING,
    "checkOut" STRING,
    "hotelName" STRING,
    "hotelPhone" STRING,
    "hotelLocation" STRING,
    "airlineName" STRING,
    "flightNumber" STRING,
    "departureAirport" STRING,
    "arrivalAirport" STRING,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "arrivalDate" TIMESTAMP(3) NOT NULL,
    "carRentalAgency" STRING,
    "carType" STRING,
    "pickupLocation" STRING,
    "dropoffLocation" STRING,
    "tripId" STRING NOT NULL,
    "userId" STRING NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
