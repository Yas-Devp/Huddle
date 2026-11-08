import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                message: "Please provide required fields: email and password." 
            });
        }

        const user = await prisma.user.findUnique({ 
            where: { email: email } 
        });


        if (!user) {
            return res.status(401).json({ 
                message: "email or password is incorrect." 
            });
        }

        
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ 
                message: "email or password is incorrect." 
            });
        }


        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );


        return res.status(200).json({
            message: "Login successful.",
            token: token,
            user: {
                id: user.id,
                email: user.email,
                nom: user.nom,
                prenom: user.prenom,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Error during login process : ", error);
        return res.status(500).json({ 
            message: "500-Internal Server Error" 
        });
    }
};