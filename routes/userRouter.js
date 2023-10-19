import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../index.js";

export const userRouter = express.Router();

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.send({
        success: false,
        error: "You must provide a username and password when logging in.",
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.send({
        success: false,
        error: "Email and/or password is invalid.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.send({
        success: false,
        error: "Email and/or password is invalid.",
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.send({
      success: true,
      token,
    });
  } catch (error) {
    return res.send({
      success: false,
      error: error.message,
    });
  }
});

userRouter.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.send({
        success: false,
        error: "All field are required when registering.",
      });
    }
    const checkUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (checkUser) {
      return res.send({
        success: false,
        error: "Email already exists, please login.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.send({
      success: true,
      token,
    });
  } catch (error) {
    return res.send({
      success: false,
      error: error.message,
    });
  }
});

userRouter.get("/token", async (req, res) => {
  try {
    if (!req.headers.authorization) {
      return next();
    }
    const token = req.headers.authorization.split(" ")[1];
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      // include: { profile: true },
    });
    delete user.password;
    res.send({
      success: true,
      user,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

userRouter.get("/me", async (req, res) => {
  try {
    // Extract the user ID from the authenticated user (you should implement authentication)
    const userId = req.user.id;
    //make sure user is logged in
    if (!userId) {
      return res.send({
        success: false,
        error: "User is not authenticated.",
      });
    }
    console.log(req.user);
    // Fetch the user data and include the profile
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.send({
        success: false,
        error: "User not found.",
      });
    }

    res.send({
      success: true,
      user,
    });
  } catch (error) {
    return res.send({
      success: false,
      error: error.message,
    });
  }
});

userRouter.put("/profile", async (req, res) => {
  try {
    const { firstName, lastName, email, profileImage, location } = req.body;

    const userId = req.user.id;

    if (!userId) {
      return res.send({
        success: false,
        error: "User is not authenticated.",
      });
    }

    // First, find the user by their ID
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.send({
        success: false,
        error: "User not found.",
      });
    }

    // // Check if the user has a profile
    // if (!user.profile) {
    //   // If the user doesn't have a profile, you may choose to create one or return an error
    //   return res.send({
    //     success: false,
    //     error:
    //       "User profile not found. You may need to create a profile for this user.",
    //   });
    // }

    // Prepare the data object dynamically
    let updateData = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (profileImage) updateData.profileImage = profileImage;
    if (location) updateData.location = location;
    // ... Add other fields similarly

    const updatedProfile = await prisma.user.update({
      where: {
        id: userId,
      },
      data: updateData,
    });

    res.send({
      success: true,
      user: updatedProfile,
    });
  } catch (error) {
    return res.send({
      success: false,
      error: error.message,
    });
  }
});

userRouter.post("/profile", async (req, res) => {
  try {
    const { profileImage, location, firstName, lastName, email } = req.body;
    const userId = req.user.id;

    if (!userId) {
      return res.send({
        success: false,
        error: "User is not authenticated.",
      });
    }

    // First, find the user by their ID
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        // profile: true, // Include the profile in the query
      },
    });

    if (!user) {
      return res.send({
        success: false,
        error: "User not found.",
      });
    }

    // // Check if the user has a profile
    // if (!user.profile) {
    //   // If the user doesn't have a profile, you may choose to create one or return an error
    //   return res.send({
    //     success: false,
    //     error:
    //       'User profile not found. You may need to create a profile for this user.',
    //   });
    // }

    // Now, update the profile information
    const newProfile = await prisma.profile.create({
      data: {
        profileImage,
        location,
        userId,
      },
    });

    res.send({
      success: true,
      user: newProfile,
    });
  } catch (error) {
    return res.send({
      success: false,
      error: error.message,
    });
  }
});
