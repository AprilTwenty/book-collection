import express from "express";
import { PrismaClient } from "@prisma/client";
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

const prisma = new PrismaClient();


async function init() {
    const app = express();
    const PORT = 4000;

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

    app.listen(PORT, () => {
        console.log("server is running on port " + PORT);
    });
}

init();
export default prisma;