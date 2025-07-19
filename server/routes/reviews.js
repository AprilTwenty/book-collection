import { Router } from "express";
import { prisma } from "../app.js";
import { reviewValidation, validateId, validateQuery, reviewUpdateValidation } from "../middleware/validateData.js"
import { protect } from "../middleware/protect.js"

const routerReviews = Router();
routerReviews.use(protect);

routerReviews.post("/", reviewValidation, async (req, res) => {
    //1 access request
    const { book_id, user_id, rating, comment } = req.body;
    const userIdFromTokenInt = parseInt(req.user.user_id, 10);
    const userIdInt = parseInt(user_id, 10);
    const bookIdInt = parseInt(book_id,10);
    const ratingInt = parseInt(rating, 10)
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
        const createReview = {
            data: {
                book_id: bookIdInt,
                user_id: userIdInt,
                rating: ratingInt,
                comment,
                created_at: new Date()
            }
        };
        const result = await prisma.reviews.create(createReview);
        //3 response
        return res.status(201).json({
            "success": true,
            "message": "Create review successfully",
            "data": result
        });
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again later"
        });
    }
});
routerReviews.get("/:reviewId", validateId("reviewId"), async (req, res) => {
    //1 access request
    //2 sql
    const findId = {
        where: { review_id: req.params.reviewId },
    };
    try {
        const result = await prisma.reviews.findUnique(findId);
        //3 response
        if (!result) {
            return res.status(404).json({
                "success": false,
                "message": "Review not found"
            })
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
routerReviews.get("/", validateQuery, async (req, res) => {
    //1 access requset
    const { user_id, book_id, page, limit } = req.query;
    //2 sql
    let searchCondition = {};
    if (user_id) {
        searchCondition = {
            user_id: user_id
        }
    }
    if (book_id) {
        searchCondition = {
            OR: [
                { user_id: user_id },
                { book_id: book_id }
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
        const result = await prisma.reviews.findMany(queryOption);
        const count = await prisma.reviews.count({ where: searchCondition });
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
routerReviews.put("/:reviewId", validateId("reviewId"), reviewUpdateValidation, async (req, res) => {
    //1 access request
    const { rating, comment } = req.body;
    //extra validate
    const checkReview = await prisma.reviews.findUnique({
        where: { review_id: req.params.reviewId }
    });
    if (!checkReview) {
        return res.status(404).json({
            "success": false,
            "message": "Review not found"
        });
    }
    const updateReview = {
        where: { review_id: req.params.reviewId },
        data: {
            rating,
            comment
        }
    }
    //2 sql
    try {
        const result = await prisma.reviews.update(updateReview);
        //3 response
        return res.status(200).json({
            "success": true,
            "message": "Update review successfully",
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
routerReviews.delete("/:reviewId", validateId("reviewId"), async (req, res) => {
    //1 access requset
    //2 sql
    const deleteReview = {
        where: { review_id: req.params.reviewId }
    }
    try {
        const deleteTarget = await prisma.reviews.findUnique(deleteReview);
        if (!deleteTarget) {
            return res.status(404).json({
                "success": false,
                "message": "Review not found"
            });
        }
        const result = await prisma.reviews.delete(deleteReview);
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
export default routerReviews;