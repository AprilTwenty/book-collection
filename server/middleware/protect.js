export const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    try {
        const token = authHeader.split(" ")[1].trim();
        const payload = jwt.verify(token, process.env.SECRET_KEY);

        // ⭐ แก้ตรงนี้
        req.user = payload;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }console.log("payload:", payload);
};

