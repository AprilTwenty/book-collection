export const protect = (req, res, next) => {
    console.log("🔥 protect middleware called");
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
        console.log("payload:", payload);
        next();
    } catch (error) {
        console.log("❌ JWT ERROR:", error.name, error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid token"
    });
}

    
};

