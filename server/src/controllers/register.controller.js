import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const { email, password, nom, prenom, telephone } = req.body;

    if (!email || !password || !nom || !prenom) {
      return res.status(400).json({
        message:
          "Please provide all required fields: email, password, nom, and prenom.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return res.status(409).json({
        message:
          "This email is already registered. Please use a different email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        nom: nom,
        prenom: prenom,
        telephone: telephone || null,
        role: "user",
      },
    });

    return res.status(201).json({
      message: "user created successfully!",
      user: {
        id: newUser.id,
        email: newUser.email,
        nom: newUser.nom,
        prenom: newUser.prenom,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Error during the register process : ", error);
    return res.status(500).json({
      message: "500-Internal Server Error",
    });
  }
};
