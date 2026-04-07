import { Router } from "express";
import { loginValidation, postUserValidation } from "../middleware/validateData.js"
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

const routerAuth = Router();

routerAuth.post("/register", postUserValidation, asyncHandler(async (req, res) => {
    //1 access req
    const { username, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    //2 
    const existingUser = await prisma.users.findFirst({
        where: {
            OR: [
                { username },
                { email }
            ]
        }
    });
    if (existingUser) {
        throw new AppError("Username or email already exist", 409);
    }
    const newUser = await prisma.$transaction(async (tx) => {
        const user = await tx.users.create({
            data: {
                username,
                email,
                password_hash: passwordHash
            }
        });
        await tx.user_profile.create({
            data: {
                user_id: user.user_id,
                avatar_url: "/default-avatar.png"
            }
        });
        return user;
    });
    return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
            user_id: newUser.user_id,
            username: newUser.username,
            email: newUser.email
        }
    });
}));

routerAuth.post("/login", loginValidation, asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const user = await prisma.users.findUnique({
        where: { username }
    });
    if (!user) {
        throw new AppError("Invalid username or password", 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
        throw new AppError("Invalid username or password", 401);
    }
    if (!process.env.SECRET_KEY) {
        throw new AppError("Sever configuration error", 500);
    }

    const token = jwt.sign(
        {
            user_id: user.user_id,
            username: user.username,
            email: user.email
        },
        process.env.SECRET_KEY,
        {
            expiresIn: "15m"
        }
    );
    return res.status(200).json({
        success: true,
        message: "Login successfully",
        token
    });
}));
export default routerAuth;