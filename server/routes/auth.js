import { Router } from "express";
import { loginValidation, postUserValidation } from "../middleware/validateData.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma.js";

const routerAuth = Router();

if (!process.env.SECRET_KEY) {
    throw new Error("Environment variable SECRET_KEY is not defined");
}

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
        const collision = await prisma.users.findUnique({
            where: { username }
        });
        if (collision) {
            return res.status(409).json({
                "success": false,
                "message": "ชื่อ username " + collision.username + " มีอยู่ในระบบแล้ว"
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
        const result = await prisma.users.create(createUser);
        //3 response
        return res.status(201).json({
            "success": true,
            "message": "User registered successfully",
            "data": result
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again later"
        });
    }
});
routerAuth.post("/login", loginValidation, async (req, res) => {
    //1 access request
    const { username, password } = req.body;
    //2 sql
    try {
        const user = await prisma.users.findUnique({
            where: { username }
        })
        if (!user) {
            return res.status(401).json({
                "success": false,
                "message": "ข้อมูล username " + username + " ไม่ถูกต้อง"
            });
        }
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({
                "success": false,
                "message": "ข้อมูล password ไม่ถูกต้อง"
            });
        }
        const token = jwt.sign(
            {
                user_id: user.user_id,
                username: user.username,
                email: user.email
            },
            process.env.SECRET_KEY,
            {
                expiresIn: '15m'
            }
        );
        //3 response
        return res.status(200).json({
            "success": true,
            "message": "Login successfully",
            token
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            "success": false,
            "message": "internal server error. Please try again later"
        });
    }
});

export default routerAuth;