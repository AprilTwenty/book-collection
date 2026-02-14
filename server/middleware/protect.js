import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    try {
        const token = authHeader.split(" ")[1];
        const payload = jwt.verify(token, process.env.SECRET_KEY);

        req.user = payload;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token invalid or expired"
        });
    }
};
