import express from "express";
import { prisma } from "../index.js";

export const profileRouter = express.Router();

// GET
profileRouter.get("/", async (req, res) => {
  try {
    const profile = await prisma.profile.findMany();
    const data = {
      success: true,
      profile,
    };
    res.json({ data });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// POST
profileRouter.post("/", async (req, res) => {
  try {
    const { picture, firstName, lastName, email, location, dob, gender } =
      req.body;

    if (!req.user) {
      return res.send({
        success: false,
        error: "Login to create a profile.",
      });
    }
    const profile = await prisma.profile.create({
      data: {
        userId: req.user.id,
        picture,
        firstName,
        lastName,
        email,
        location,
        dob,
        gender,
      },
    });

    res.send({
      success: true,
      profile,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// PUT
profileRouter.put("/:profileId", async (req, res) => {
  const { profileId } = req.params;
  console.log(profileId);
  try {
    const { picture, firstName, lastName, email, location, dob, gender } =
      req.body;

    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      return res.send({
        success: false,
        error: "Profile not found.",
      });
    }

    if (req.user.id !== profile.userId) {
      return res.send({
        success: false,
        error: "You must be the user of this profile to modify it!",
      });
    }

    if (!req.user) {
      return res.send({
        success: false,
        error: "Login to make changes in your profile.",
      });
    }

    if (!firstName || !lastName || !email) {
      return res.send({
        success: false,
        error:
          "All mandatory fields are required when making changes in your profile.",
      });
    }

    const updatedProfile = await prisma.profile.update({
      where: {
        id: profileId,
      },
      data: {
        userId: req.user.id,
        picture,
        firstName,
        lastName,
        email,
        location,
        dob,
        gender,
      },
    });

    res.send({
      success: true,
      updatedProfile,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// DELETE
profileRouter.delete("/:profileId", async (req, res) => {
  try {
    const { profileId } = req.params;
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      return res.send({
        success: false,
        error: "Profile not found.",
      });
    }

    if (req.user.id !== profile.userId) {
      return res.send({
        success: false,
        error: "You must be the user of this profile to delete it!",
      });
    }

    if (!req.user) {
      return res.send({
        success: false,
        error: "Login to make changes in your profile.",
      });
    }

    const deletedProfile = await prisma.profile.delete({
      where: { id: profileId },
    });

    res.send({
      success: true,
      deletedProfile,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});
