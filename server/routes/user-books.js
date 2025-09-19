import { Router } from "express";
import { prisma } from "../prisma.js";
import { userBookValidation, validateId, userIdQueryValidation, validateQuery, userBookStatusValidation } from "../middleware/validateData.js"
import { protect } from "../middleware/protect.js"

const routerUserBooks = Router();
routerUserBooks.use(protect);

routerUserBooks.post("/", protect, userBookValidation, async (req, res) => {
    //1 access request
    const { book_id, user_id, status } = req.body;
    const userIdFromTokenInt = parseInt(req.user.user_id, 10);
    const userIdInt = parseInt(user_id, 10);
    const bookIdInt = parseInt(book_id,10);
    try {
        //2 sql
        if (userIdFromTokenInt !== userIdInt) {
            return res.status(403).json({
                "success": false,
                "message": "User ID mismatch: Access denied"
            });
        }
        const user = await prisma.users.findUnique({ where: { user_id: userIdInt } });
        if (!user) {
            return res.status(404).json({
                "success": false,
                "message": "User not found"
            });
        }
        const book = await prisma.books.findUnique({ where: { book_id: bookIdInt }});
        if (!book) {
            return res.status(404).json({
                "success": false,
                "message": "Book not found"
            });
        }
        const saveBook = {
            data: {
                book_id: bookIdInt,
                user_id: userIdInt,
                status,
                created_at: new Date(),
                updated_at: new Date()
            }
        };
        const result = await prisma.user_books.create(saveBook);
        //3 response
        return res.status(201).json({
            "success": true,
            "message": "Save book successfully",
            "data": result
        });
    } catch (error) {
                    console.error("error: " + error)
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again later"
        });
    }
});
routerUserBooks.get("/:userBookId", validateId("userBookId"), async (req, res) => {
    //1 access request
    //2 sql
    const findId = {
        where: { user_book_id: req.params.userBookId },
    };
    try {
        const result = await prisma.user_books.findUnique(findId);
        //3 response
        if (!result) {
            return res.status(404).json({
                "success": false,
                "message": "Storage book not found"
            });
        }
        return res.status(200).json({
            "success": true,
            "data": result
        });
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again later"
        });
    }
});
routerUserBooks.get("/", validateQuery, userIdQueryValidation,  async (req, res) => {
    //1 access requset
    const { user_id, status, page, limit } = req.query;
    const userIdInt = parseInt(user_id, 10);
    //2 sql
    let searchCondition = {};
    if (user_id) {
        searchCondition = {
            user_id: userIdInt
        }
    }
    if (status) {
        searchCondition = {
            status: status
        }
    }
    if (status && user_id) {
        searchCondition = {
            AND: [
                { user_id: userIdInt },
                { status }
            ]
        }
    }
    let queryOption = { 
        where: searchCondition,
    };
    if (page !== undefined && limit !== undefined) {
        const pageInt = parseInt(page, 10);
        const limitInt = parseInt(limit, 10);
        queryOption.skip = (pageInt - 1) * limitInt;
        queryOption.take = limitInt;
    }
    try {
        const result = await prisma.user_books.findMany(queryOption);
        const count = await prisma.user_books.count({ where: searchCondition });
        //3 response
        return res.status(200).json({
            "success": true,
            "count": count,
            "data": result
        });
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again"
        });
    }
});
routerUserBooks.put("/:userBookId", validateId("userBookId"), userBookStatusValidation, async (req, res) => {
    //1 access request
    const { status } = req.body;
    //extra validate
    const checkReview = await prisma.user_books.findUnique({
        where: { user_book_id: req.params.userBookId }
    });
    if (!checkReview) {
        return res.status(404).json({
            "success": false,
            "message": "Review not found"
        });
    }
    const updateStatus = {
        where: { user_book_id: req.params.userBookId },
        data: {
            status
        }
    }
    //2 sql
    try {
        const result = await prisma.user_books.update(updateStatus);
        //3 response
        return res.status(200).json({
            "success": true,
            "message": "Update status successfully",
            "data": result
        });        
    } catch(error) {
        console.error("error:" + error)
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again later"
        });
    }
});
/*
import { UserBookStatus } from '@prisma/client'; // ดึง enum มาใช้จาก Prisma

routerUserBooks.put("/:userBookId", validateId("userBookId"), async (req, res) => {
    const { status } = req.body;

    // ตรวจสอบว่าค่าที่รับมาถูกต้องหรือไม่
    if (!Object.values(UserBookStatus).includes(status)) {
        return res.status(400).json({
            success: false,
            message: `ค่าของ status ไม่ถูกต้อง ต้องเป็น ${Object.values(UserBookStatus).join(", ")}`
        });
    }

    try {
        const result = await prisma.user_books.update({
            where: { user_book_id: req.params.userBookId },
            data: { status: UserBookStatus[status] } // ใช้ enum จาก Prisma
        });

        return res.status(200).json({
            success: true,
            message: "Update status successfully",
            data: result
        });

    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }
        console.error("error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later"
        });
    }
});
*/
routerUserBooks.delete("/:userBookId", validateId("userBookId"), async (req, res) => {
    //1 access requset
    //2 sql
    const deleteUserBook = {
        where: { user_book_id: req.params.userBookId }
    }
    try {
        const deleteTarget = await prisma.user_books.findUnique(deleteUserBook);
        if (!deleteTarget) {
            return res.status(404).json({
                "success": false,
                "message": "Keep book not found"
            });
        }
        const result = await prisma.user_books.delete(deleteUserBook);
        //3 response
        return res.status(200).json({
            "success": true,
            "message": "Delete review successfully",
            "data": result
        });
    } catch (error) {
            console.error(error)
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again later"
        });
    }
});
export default routerUserBooks;