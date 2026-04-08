import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";


export const protect = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        throw new AppError("Unauthorized", 401);
    }
    const token = authHeader.split(" ")[1].trim();
    if (!process.env.SECRET_KEY) {
        throw new AppError("Server configuration error", 500);
    }
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    req.user = payload;
    next();
    /*
    try {
        const token = authHeader.split(" ")[1].trim();
        const payload = jwt.verify(token, process.env.SECRET_KEY);

        // ⭐ แก้ตรงนี้
        req.user = payload;
        next();
    } catch (error) {
        console.log("❌ JWT ERROR:", error.name, error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid token"
    });
    */
});

