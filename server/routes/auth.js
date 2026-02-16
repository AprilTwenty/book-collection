import { Router } from "express";
import { loginValidation, postUserValidation } from "../middleware/validateData.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";

const routerAuth = Router();

routerAuth.post("/register", postUserValidation, async (req, res) => {
    //1 access request
    const { username, email, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt)
        //2 sql
        const createUser = {
            data: {
                username,
                email,
                password_hash: passwordHash,
                created_at: new Date(),
                updated_at: new Date()
            }
        };
        const collisionUser = await prisma.users.findUnique({
            where: { username }
        });
        if (collisionUser) {
            return res.status(409).json({
                "success": false,
                "message": "ชื่อ username " + collisionUser.username + " มีอยู่ในระบบแล้ว"
            });
        }
        const collisionEmail = await prisma.users.findUnique({
            where: { email }
        });
        if (collisionEmail) {
            return res.status(409).json({
                "success": false,
                "message": "ชื่อ email " + collisionEmail.email + " มีอยู่ในระบบแล้ว"
            });
        }
        // const result = await prisma.users.create(createUser); //old version not create user_profile
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.users.create(createUser);
            await tx.user_profile.create({
                data: {
                user_id: user.user_id,
                avatar_url: "/default-avatar.png"
                }
            });
            return user;
        });
        
        //3 response
        return res.status(201).json({
            "success": true,
            "message": "User registered successfully",
            "data": result
        });
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again later"
        });
    }
}); 
routerAuth.post("/login", loginValidation, async (req, res) => {

    const { username, password } = req.body;

    try {
        const user = await prisma.users.findUnique({
            where: { username }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: `ข้อมูล username ${username} ไม่ถูกต้อง`
            });
        }

        const isValidPassword = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: "ข้อมูล password ไม่ถูกต้อง"
            });
        }

        const token = jwt.sign(
            {
                user_id: user.user_id,
                username: user.username,
                email: user.email
            },
            process.env.SECRET_KEY,
            { expiresIn: "15m" }
        );

        // ⭐⭐⭐ จุดสำคัญ
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,      // ต้อง true บน https (Vercel)
            sameSite: "none",  // อนุญาต cross-domain
            maxAge: 15 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Login successfully",
            token: token 
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "internal server error"
        });
    }
});


export default routerAuth;