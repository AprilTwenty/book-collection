import { Router } from "express";
import prisma from "../prisma/client.js";
import { reviewValidation, validateId, validateQuery, reviewUpdateValidation } from "../middleware/validateData.js"
import { protect } from "../middleware/protect.js"

const routerReviews = Router();
//routerReviews.use(protect);

routerReviews.post("/", protect, reviewValidation, async (req, res) => {
    //1 access request
    const { book_id, rating, comment } = req.body;
    const userIdInt = parseInt(req.user.user_id, 10);
    const bookIdInt = parseInt(book_id,10);
    const ratingInt = parseInt(rating, 10)
    try {
        //2 sql
        /*
        const user = await prisma.users.findUnique({ where: { user_id: userIdInt } });
        if (!user) {
            return res.status(404).json({
                "success": false,
                "message": "User not found"
            });
        }
        */
        const book = await prisma.books.findUnique({ where: { book_id: bookIdInt }});
        if (!book) {
            return res.status(404).json({
                "success": false,
                "message": "Book not found"
            });
        }
        const existing = await prisma.reviews.findFirst({
            where:{
                book_id: bookIdInt,
                user_id: userIdInt
            }
        });
        if (existing){
            return res.status(409).json({
                success:false,
                message:"You already reviewed this book"
            });
        }
        const createReview = {
            data: {
                book_id: bookIdInt,
                user_id: userIdInt,
                rating: ratingInt,
                comment
            }
        };
        const result = await prisma.reviews.create(createReview);
        const avg = await prisma.reviews.aggregate({
            where:{ book_id: bookIdInt },
            _avg:{ rating:true }
        });

        await prisma.books.update({
            where:{ book_id: bookIdInt },
            data:{ average_rating: avg._avg.rating ?? 0}

        });

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
    const reviewIdInt = parseInt(req.params.reviewId, 10);
    const findId = {
        where: { review_id: reviewIdInt },
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
    searchCondition.user_id = parseInt(user_id);
    }
    if (book_id) {
    searchCondition.book_id = parseInt(book_id);
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
    console.log("query:", req.query);
    try {
        //const result = await prisma.reviews.findMany(queryOption);
        

        const result = await prisma.reviews.findMany({
            ...queryOption,
            include:{
                user:{
                select:{
                    user_id:true,
                    username:true,
                    avatar_url:true
                }
                }
            }
        });
        const count = await prisma.reviews.count({ where: searchCondition });
        //3 response
        return res.status(200).json({
            "success": true,
            "count": count,
            "data": result
        });
    } catch (error) {
        console.error("GET /reviews error:", error);
        
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again"
        });
    }
});
routerReviews.put("/:reviewId", protect, validateId("reviewId"), reviewUpdateValidation, async (req, res) => {
    //1 access request
    const { rating, comment } = req.body;
    const reviewIdInt = parseInt(req.params.reviewId, 10);
    //extra validate
    const checkReview = await prisma.reviews.findUnique({
        where: { review_id: reviewIdInt }
    });
    if (!checkReview) {
        return res.status(404).json({
            "success": false,
            "message": "Review not found"
        });
    }
    if (checkReview.user_id !== req.user.user_id) {
        return res.status(403).json({
            success:false,
            message:"Forbidden"
        });
    }
    const updateReview = {
        where: { review_id: reviewIdInt },
        data: {
            rating,
            comment
        }
    }
    //2 sql
    try {
        const result = await prisma.reviews.update(updateReview);
        /*
        const avg = await prisma.reviews.aggregate({
            where:{ book_id: checkReview.book_id },
            _avg:{ rating:true }
        });
        await prisma.books.update({
            where:{ book_id: checkReview.book_id },
            data:{ average_rating: avg._avg.rating ?? 0 }
        });
        */
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
routerReviews.delete("/:reviewId", protect, validateId("reviewId"), async (req, res) => {
    //1 access requset
    const reviewIdInt = parseInt(req.params.reviewId, 10);
    //2 sql
    const deleteReview = {
        where: { review_id: reviewIdInt }
    }
    try {
        const deleteTarget = await prisma.reviews.findUnique(deleteReview);
        if (!deleteTarget) {
            return res.status(404).json({
                "success": false,
                "message": "Review not found"
            });
        }
        if (deleteTarget.user_id !== req.user.user_id) {
            return res.status(403).json({
            success:false,
            message:"Forbidden"
        });
    }
        const result = await prisma.reviews.delete(deleteReview);
        /*
        const avg = await prisma.reviews.aggregate({
            where:{ book_id: deleteTarget.book_id },
            _avg:{ rating:true }
        });
        await prisma.books.update({
            where:{ book_id: deleteTarget.book_id },
            data:{ average_rating: avg._avg.rating ?? 0 }
        });
        */
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