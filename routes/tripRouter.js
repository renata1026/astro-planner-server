import express from "express";
import { prisma } from "../index.js";

export const tripRouter = express.Router();

// GET /trips
tripRouter.get("/", async (req, res) => {
  try {
    const trip = await prisma.trip.findMany();
    const data = {
      success: true,
      trip,
    };
    res.json({ data });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

//  POST /trips

tripRouter.post("/", async (req, res) => {
  console.log(req.user);
  try {
    const { checkIn, checkOut, passengers, location } = req.body;
    // const userId = req.user ? req.user.id : null;
    if (!location || !checkIn || !checkOut || !passengers) {
      return res.send({
        success: false,
        error: "You must provide all fields to create a trip",
      });
    }
    // if (!req.user) {
    //   return res.send({
    //     success: false,
    //     error: "Login to create a trip.",
    //   });
    // }
    const trip = await prisma.trip.create({
      data: {
        userId: req.user.id,
        checkIn,
        checkOut,
        location,
        passengers,
      },
    });
    res.send({
      success: true,
      trip,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

tripRouter.put("/:tripId", async (req, res) => {
  const { tripId } = req.params;
  const { checkIn, checkOut, passengers, location } = req.body;

  try {
    if (!location || !checkIn || !checkOut || !passengers) {
      return res.send({
        success: false,
        error: "You must provide all fields to create a trip",
      });
    }

    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId,
      },
    });

    if (!trip) {
      return res.send({
        success: false,
        error: "Trip not found.",
      });
    }

    // if (!req.user) {
    //   return res.send({
    //     success: false,
    //     error: "Login to create a trip.",
    //   });
    // }

    if (req.user.id !== trip.userId) {
      return res.send({
        success: false,
        error: "You must be the owner of this trip to delete!",
      });
    }
    const updatedTrip = await prisma.trip.update({
      where: {
        id: tripId,
      },
      data: {
        userId: req.user.id,
        checkIn,
        checkOut,
        location,
        passengers,
      },
    });
    res.send({
      success: true,
      updatedTrip,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

tripRouter.delete("/:tripId", async (req, res) => {
  try {
    const { tripId } = req.params;

    if (!req.user) {
      return res.send({
        success: false,
        error: "Please log in to delete a trip.",
      });
    }

    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId,
      },
    });

    if (!trip) {
      return res.send({
        success: false,
        error: "Trip not found.",
      });
    }

    if (req.user.id !== trip.userId) {
      return res.send({
        success: false,
        error: "You must be the owner of this trip to delete!",
      });
    }

    await prisma.reservation.deleteMany({
      where: {
        tripId: tripId,
      },
    });

    const deletedTrip = await prisma.trip.delete({
      where: {
        id: tripId,
      },
    });

    res.send({
      success: true,
      deletedTrip,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

export default tripRouter;
