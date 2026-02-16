import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    try {
        if (!process.env.SECRET_KEY) {
            throw new Error("SECRET_KEY missing");
        }

        const token = authHeader.split(" ")[1]?.trim();
        const payload = jwt.verify(token, process.env.SECRET_KEY);

        req.user = { id: payload.id };

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expired"
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};
