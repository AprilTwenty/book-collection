import { Router } from "express";
import prisma from "../prisma/client.js";
import { reviewValidation, validateId, validateQuery, reviewUpdateValidation } from "../middleware/validateData.js"
import { protect } from "../middleware/protect.js"
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

const routerReviews = Router();
//routerReviews.use(protect);

const reviewInclude = {
  users:{
    select:{
      user_id:true,
      username:true,
      user_profile:{
        select:{
          avatar_url:true
        }
      }
    }
  }
};

routerReviews.post("/", protect, reviewValidation, asyncHandler(async (req, res) => {
    const { book_id, rating, comment } = req.body;
    const userIdInt = parseInt(req.user.user_id, 10);
    const bookIdInt = parseInt(book_id,10);
    const ratingInt = parseInt(rating, 10)

    const reviewData = {
        book_id: bookIdInt,
        user_id: userIdInt,
        rating: ratingInt,
        comment
    };

    const createdReview = await prisma.$transaction(async (tx) => {
        const currentBook = await tx.books.findUnique({
            where : {
                book_id : bookIdInt
            },
            select: {
                book_id: true,
                rating_count: true,
                rating_sum: true
            }
        });
        if (!currentBook) {
            throw new AppError(`Book not found`, 404);
        }
        const existingReview = await tx.reviews.findUnique({
            where : {
                book_id_user_id: {
                    book_id: bookIdInt,
                    user_id: userIdInt
                }
            }
        });
        if (existingReview) {
            throw new AppError(`Review already exists`, 409);
        }
        const newReview = await tx.reviews.create({
            data: reviewData,
            include: reviewInclude
        });
        const newRatingCount = currentBook.rating_count + 1;
        const newRatingSum = currentBook.rating_sum + ratingInt;
        const newAvgRating = newRatingSum / newRatingCount;
        await tx.books.update({
            where: {
                book_id: bookIdInt
            },
                data: {
                    rating_count: newRatingCount,
                    rating_sum: newRatingSum,
                    rating_avg: newAvgRating
                }
        });
        return newReview;
    });
    return res.status(201).json({
        success: true,
        message: "Review created successfully",
        data: createdReview
    });
}));

routerReviews.get("/:reviewId", validateId("reviewId"), asyncHandler(async (req, res) => {
    const reviewIdInt = parseInt(req.params.reviewId, 10);
    const reviewData = await prisma.reviews.findUnique({
        where: { review_id: reviewIdInt },
        include: reviewInclude
    });
    if (!reviewData) {
        throw new AppError(`Review not found`, 404);
    }
    return res.status(200).json({
        success: true,
        data: reviewData
    });
}));

routerReviews.get("/", validateQuery, asyncHandler( async(req, res) => {
    const { user_id, book_id, page, limit } = req.query;
    const userIdInt = parseInt(user_id, 10);
    const bookIdInt = parseInt(book_id, 10);

    let filters = {};
    if (user_id) {
        filters.user_id = userIdInt;
    }
    if (book_id) {
        filters.book_id = bookIdInt;
    }

    const queryOptions = { 
        where: filters,
    };
    if (page !== undefined && limit !== undefined) {
        const pageInt = parseInt(page, 10);
        const limitInt = parseInt(limit, 10);
        queryOptions.skip = (pageInt - 1) * limitInt;
        queryOptions.take = limitInt;
    }

    const reviewData = await prisma.reviews.findMany({
        ...queryOptions,
        include: reviewInclude,
        orderBy: {
            created_at: "desc"
        }
    });
    const reviewCount = await prisma.reviews.count({ where: filters });

    return res.status(200).json({
        success: true,
        count: reviewCount,
        data: reviewData
    });
}));

routerReviews.put("/:reviewId", protect, validateId("reviewId"), reviewUpdateValidation, asyncHandler(async (req, res) => {
    const reviewIdInt = parseInt(req.params.reviewId, 10);
    const userIdInt = parseInt(req.user.user_id, 10);
    const { rating, comment } = req.body;

    const updatedReview = await prisma.$transaction(async (tx) => {
        const currentReview = await tx.reviews.findUnique({
            where: {
                review_id: reviewIdInt
            },
            select: {
                user_id: true,
                rating: true,
                book_id: true
            }
        });
        if (!currentReview) {
            throw new AppError(`Review not found`, 404);
        }
        if (currentReview.user_id !== userIdInt) {
            throw new AppError(`Forbidden`, 403);
        }
        const updatedReview = await tx.reviews.update({
            where: { review_id: reviewIdInt },
            data: {
                ...(rating !== undefined && { rating }),
                ...(comment !== undefined && { comment })
            },
            include: reviewInclude
        });
        if (rating !== undefined && rating !== currentReview.rating) {
            const currentBook = await tx.books.findUnique({
                where: { book_id: currentReview.book_id },
                select: {
                    rating_sum: true,
                    rating_count: true
                }
            });
            if (!currentBook) {
                throw new AppError(`Book not found`, 404);
            }
            const ratingDiff  = rating - currentReview.rating;
            const newRatingSum = currentBook.rating_sum + ratingDiff;
            const newAvgRating = newRatingSum / currentBook.rating_count;

            await tx.books.update({
            where: { book_id: currentReview.book_id },
            data: {
                rating_sum: newRatingSum,
                rating_avg: newAvgRating
            }
            });
        }
        return updatedReview;
    });
    return res.status(200).json({
        success: true,
        message: "Update review successfully",
        data: updatedReview
    });
}));

routerReviews.delete("/:reviewId",protect, validateId("reviewId"), asyncHandler (async (req, res) => {
    const reviewIdInt = parseInt(req.params.reviewId, 10);
    const userIdInt = parseInt(req.user.user_id, 10);

    const reviewWhere = {
        where: { review_id: reviewIdInt }
    }
    
    const deletedReview = await prisma.$transaction(async (tx) => {
        const currentReview = await tx.reviews.findUnique({
            ...reviewWhere,
            select: {
                user_id: true,
                book_id: true,
                rating: true
            }
        });
        if (!currentReview) {
            throw new AppError(`Review not found`, 404);
        }
        if (currentReview.user_id !== userIdInt) {
            throw new AppError(`Forbidden`, 403);
        }
        
        const deletedReview = await tx.reviews.delete(reviewWhere);

        const bookWhere = {where: { book_id: currentReview.book_id }};

        const currentBook = await tx.books.findUnique({
            ...bookWhere,
            select: {
                rating_sum: true,
                rating_count: true
            }
        });
        if (!currentBook) {
            throw new AppError(`Book not found`, 404);
        }
        const newRatingSum = currentBook.rating_sum - currentReview.rating;
        const newRatingCount = currentBook.rating_count - 1;
        const newAvgRating = newRatingCount > 0 ? newRatingSum / newRatingCount : 0;

        await tx.books.update({
            ...bookWhere,
            data: {
                rating_count: newRatingCount,
                rating_sum: newRatingSum,
                rating_avg: newAvgRating
            }
        });
        return deletedReview;
    });
    return res.status(200).json({
        success: true,
        message: "Delete review successfully",
        data: deletedReview
    });
}));

export default routerReviews;