import express from "express";
import routerBooks from "./routes/books.js";
import routerAuthors from "./routes/authors.js";
import routerCategories from "./routes/categories.js";
import routerAuth from "./routes/auth.js";
import routerUsers from "./routes/users.js"
import routerReviews from "./routes/reviews.js";
import routerUserBooks from "./routes/user-books.js";
import routerCustomCollections from "./routes/custom-collections.js";
import routerUserProfile from "./routes/user-profile.js";
import swaggerSetup from "./swagger.js";
import cors from "cors";
import dotenv from 'dotenv';
import AppError from "./utils/AppError.js";
import crypto from "node:crypto";
import pinoHttp from "pino-http";
import logger from "./utils/logger.js";


dotenv.config();
const app = express();
const PORT = 4000;

app.use(cors());

app.use(
    pinoHttp({
        logger,

        genReqId: (req) =>
            req.headers["x-request-id"] || crypto.randomUUID(),

        customLogLevel: (res, err) => {
            if (res.statusCode >= 500) return "error";
            if (res.statusCode >= 400) return "warn";
            return "info";
        },

        customProps: (req) => ({
            url: req.originalUrl,
            method: req.method
        })
    })
);

app.use(express.json());
app.use("/books", routerBooks);
app.use("/authors", routerAuthors);
app.use("/categories", routerCategories);
app.use("/auth", routerAuth);
app.use("/users", routerUsers);
app.use("/reviews", routerReviews);
app.use("/userbooks", routerUserBooks);
app.use("/customcollections", routerCustomCollections);
app.use("/userprofile", routerUserProfile);

swaggerSetup(app); // เปิดใช้งาน Swagger UI

app.get('/', (req, res) => {
 
    res.json(
        {
            success: true,
            message: 'API Running'
        }
    );
});

app.use((req, res) => {
    req.log.warn({ url: req.originalUrl }, "Route not found");

    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

app.use((err, req, res, next) => {
    (req.log || logger).error({
        msg: err.message,
        stack: err.stack,
        code: err.code,
        meta: err.meta,
        url: req.originalUrl,
        statusCode: err.statusCode
    });

    if (err.name === "JsonWebTokenError") {
        err = new AppError("Invalid token", 401);
    }
    if (err.name === "TokenExpiredError") {
        err = new AppError("Expired token", 401);
    }

    const status = err.statusCode || 500;

    res.status(status).json({
        success: false,
        message: status === 500 ? "Internal server error" : err.message
    });
});

app.listen(PORT, () => {
    console.log("server is running on port " + PORT);
});


export default app;