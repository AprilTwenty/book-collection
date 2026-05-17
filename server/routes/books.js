import { Router } from "express";
import { postBookValidation, validateQuery } from "../middleware/validateData.js";
import prisma from "../prisma/client.js";
import asyncHandler from "../utils/asyncHandler.js";
import { create } from "node:domain";

const routerBooks = Router();

routerBooks.get("/latest", async (req, res) => {
    //1 access req
    let limit = Number(req.query.limit) || 10;
    if (limit < 1) limit = 1;
    if (limit > 50) limit = 50;
    //2 sql section
    const latestQuery = {
            orderBy: {
                created_at: "desc"
            },
            select: {
                book_id: true,
                title: true,
                cover_url: true
            },
            take: limit
        }
    try {
        const result = await prisma.books.findMany(latestQuery);
        //3 respone section
        return res.status(200).json({
            "success": true,
            "data": result
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again later."
        });
    }
});

routerBooks.get("/:bookId", async (req, res) => {
    //1 access body and req
    const bookIdFromClient = req.params.bookId;
    const bookIdFromClientInt = parseInt(bookIdFromClient, 10);
    if (isNaN(bookIdFromClientInt)) {
        return res.status(400).json({
            "success": false,
            "message": "ข้อมูล book_id ไม่ถูกต้อง"
        });
    }
    //2 sql statment
    try {
    const book = await prisma.books.findUnique({
        where: {book_id: bookIdFromClientInt},
        include: { 
            book_authors: {include: { authors: true }},
            book_categories: {include: { categories: true }}
         }
    });
    //3 res section
    if (!book) {
        return res.status(404).json({
            "success": false,
            "message": "Book not found"
        });
    }
    const ratingData = await prisma.reviews.aggregate({
        where: { book_id: bookIdFromClientInt },
        _avg: { rating: true },
        _count: { rating: true }
    });
    const simpleResult = {
        "book_id": book.book_id,
        "title": book.title,
        "description": book.description,
        "isbn": book.isbn,
        "publisher": book.publisher,
        "published_year": book.published_year,
        "average_rating": ratingData._avg.rating ?? 0,
        "total_reviews": ratingData._count.rating,
        "cover_url": book.cover_url,
        "created_at": book.created_at,
        "updated_at": book.updated_at,
        "author": book.book_authors.map((arr_author) => {
            return arr_author.authors.name}),
        "category": book.book_categories.map((arr_category) => {
            return arr_category.categories.name})
    }
    return res.status(200).json({
        "success": true,
        "data": simpleResult
    })
    } catch (error) {
        console.error("[Error retrieving book]:", error);
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again later."
        });
    }
});
/*
routerBooks.get("/", validateQuery, async (req, res) => {
    // 1️⃣ access req
    const { name, category, author, page, limit, sort, order } = req.query;
    let limitInt = parseInt(limit, 10);

    if (!limit || isNaN(limitInt)) limitInt = 25;
    if (limitInt < 1) limitInt = 1;
    if (limitInt > 50) limitInt = 50;

    const allowedSortFields = [
        "title",
        "published_year",
        "created_at",
        "rating"
    ];
    const safeSort = allowedSortFields.includes(sort) ? sort : "created_at";
    const safeOrder = order === "asc" ? "asc" : "desc";

    let filters = {};
    if (name) {
        filters.title = { contains: name, mode: "insensitive" };
    }

    if (author) {
        filters.book_authors = {
        some: {
            authors: { name: { contains: author, mode: "insensitive" } }
        }
        };
    }

    if (category) {
        filters.book_categories = {
        some: {
            categories: { name: { contains: category, mode: "insensitive" } }
        }
        };
    }

    // 2️⃣ prepare query option
    let queryOption = {
        where: filters
    };

    // pagination
    if (page !== undefined && limit !== undefined) {
        const pageInt = parseInt(page, 10);
        const limitInt = parseInt(limit, 10);

        queryOption.skip = (pageInt - 1) * limitInt;
        queryOption.take = limitInt;
    }

    // sort ปกติ (ยกเว้น rating)
    if (safeSort !== "rating") {
        queryOption.orderBy = {
        [safeSort]: safeOrder
        };
    }

    try {
        // include relations
        queryOption.include = {
            book_authors: { include: { authors: true } },
            book_categories: { include: { categories: true } },
            reviews: { select: { rating: true } }
        };

    const result = await prisma.books.findMany(queryOption);

    const totalCount = await prisma.books.count({
      where: filters
    });

    // 3️⃣ map result
    let simpleResult = result.map((data) => {
        const avgRating =
            data.reviews.length > 0
            ? data.reviews.reduce((sum, r) => sum + r.rating, 0) /
                data.reviews.length
            : 0;

        return {
            book_id: data.book_id,
            title: data.title,
            description: data.description,
            isbn: data.isbn,
            publisher: data.publisher,
            published_year: data.published_year,
            cover_url: data.cover_url,
            created_at: data.created_at,
            updated_at: data.updated_at,
            author: data.book_authors.map((a) => a.authors.name),
            category: data.book_categories.map((c) => c.categories.name),
            rating: avgRating
        };
    });

    // 4️⃣ sort by rating (หลังจากมี simpleResult แล้ว)
    if (safeSort === "rating") {
        simpleResult.sort((a, b) =>
            safeOrder === "asc"
            ? a.rating - b.rating
            : b.rating - a.rating
        );
    }

    // 5️⃣ response
    return res.status(200).json({
        success: true,
        data: simpleResult,
        total: totalCount
    });

    } catch (error) {
        console.error("Error in GET /books:", error);
        return res.status(500).json({
        success: false,
        message: "Internal server error. Please try again later."
        });
    }
});
*/
/*
routerBooks.get("/", validateQuery, asyncHandler(async (req, res) => {
    const { name, category, author, page = 1, limit = 25, sort, order } = req.query;
    const nameParam = name || null;
    const authorParam = author || null;
    const categoryParam = category || null;
    const safeOrderPrisma = order === "asc" ? "asc" : "desc";
    const pageInt = parseInt(page, 10) || 1;
    const limitInt = parseInt(limit, 10) || 25;
    const offset = (pageInt - 1) * limitInt;

    let data = [];
    let total = 0;
    // sort by rating
    if (sort === "rating") {
        const orderSQL = order === "asc" ? "ASC" : "DESC";

        const query = `
            SELECT
                b.book_id,
                b.title,
                b.description,
                b.isbn,
                b.publisher,
                b.published_year,
                b.cover_url,
                b.created_at,
                b.updated_at,

                ARRAY_AGG(DISTINCT a.name ORDER BY a.name)
                    FILTER (WHERE a.name IS NOT NULL) AS authors,

                ARRAY_AGG(DISTINCT c.name ORDER BY c.name)
                    FILTER (WHERE c.name IS NOT NULL) AS categories,

                MAX(COALESCE(r.avg_rating, 0)) AS rating

            FROM books b

            LEFT JOIN (
                SELECT book_id, AVG(rating) AS avg_rating
                FROM reviews
                GROUP BY book_id
            ) r ON r.book_id = b.book_id

            LEFT JOIN book_authors ba ON ba.book_id = b.book_id
            LEFT JOIN authors a ON a.author_id = ba.author_id

            LEFT JOIN book_categories bc ON bc.book_id = b.book_id
            LEFT JOIN categories c ON c.category_id = bc.category_id

            WHERE
                ($1::text IS NULL OR b.title ILIKE '%' || $1 || '%')
                AND ($2::text IS NULL OR EXISTS (
                    SELECT 1
                    FROM book_authors ba2
                    JOIN authors a2 ON a2.author_id = ba2.author_id
                    WHERE ba2.book_id = b.book_id
                    AND a2.name ILIKE '%' || $2 || '%'
                ))
                AND ($3::text IS NULL OR EXISTS (
                    SELECT 1
                    FROM book_categories bc2
                    JOIN categories c2 ON c2.category_id = bc2.category_id
                    WHERE bc2.book_id = b.book_id
                    AND c2.name ILIKE '%' || $3 || '%'
                ))

            GROUP BY b.book_id
            ORDER BY rating ${orderSQL}

            LIMIT $4 OFFSET $5
        `;

        data = await prisma.$queryRawUnsafe(
            query,
            nameParam,
            authorParam,
            categoryParam,
            limitInt,
            offset
        );
        const totalQuery = `
            SELECT COUNT(*)::bigint as count
            FROM books b
            WHERE
                ($1::text IS NULL OR b.title ILIKE '%' || $1 || '%')
                AND ($2::text IS NULL OR EXISTS (
                    SELECT 1
                    FROM book_authors ba2
                    JOIN authors a2 ON a2.author_id = ba2.author_id
                    WHERE ba2.book_id = b.book_id
                    AND a2.name ILIKE '%' || $2 || '%'
                ))
                AND ($3::text IS NULL OR EXISTS (
                    SELECT 1
                    FROM book_categories bc2
                    JOIN categories c2 ON c2.category_id = bc2.category_id
                    WHERE bc2.book_id = b.book_id
                    AND c2.name ILIKE '%' || $3 || '%'
                ))
        `;

        const totalResult = await prisma.$queryRawUnsafe(
            totalQuery,
            nameParam,
            authorParam,
            categoryParam
        );
        total = Number(totalResult[0]?.count ?? 0);
    } else {
        // normal sort 
        const allowedSortFields = [
            "title",
            "published_year",
            "created_at"
        ];
        const safeSort = allowedSortFields.includes(sort) ? sort : "created_at";
        const whereClause = {
            ...(name && {
                title: { contains: name, mode: "insensitive" }
            }),
            ...(author && {
                book_authors: {
                    some: {
                        authors: {
                            name: { contains: author, mode: "insensitive" }
                        }
                    }
                }
            }),
            ...(category && {
                book_categories: {
                    some: {
                        categories: {
                            name: { contains: category, mode: "insensitive" }
                        }
                    }
                }
            })
        }
        const result = await prisma.books.findMany({
            where: whereClause,
            orderBy: {
                [safeSort]: safeOrderPrisma
            },
            skip: offset,
            take: limitInt,
            include: {
                book_authors: { include: { authors: true } },
                book_categories: { include: { categories: true } },
                reviews: { select: { rating: true } }
            }
        });
        total = await prisma.books.count({
            where: whereClause
        });
        data = result.map((b) => {
            const avg = b.reviews.length > 0 ? b.reviews.reduce((s, r) => s + r.rating, 0) / b.reviews.length : 0;
            return {
                ...b,
                avg_rating: avg
            };
        });
    }
    const finalData = data.map((b) => {
        const authors =
            b.authors ??
            b.book_authors?.map((a) => a.authors.name) ??
            [];

        const categories =
            b.categories ??
            b.book_categories?.map((c) => c.categories.name) ??
            [];

        const rating =
            b.rating ??
            b.avg_rating ??
            0;

        return {
            book_id: b.book_id,
            title: b.title,
            description: b.description,
            isbn: b.isbn,
            publisher: b.publisher,
            published_year: b.published_year,
            cover_url: b.cover_url,
            created_at: b.created_at,
            updated_at: b.updated_at,
            author: authors,
            category: categories,
            rating: Number(rating)
        };
    });
    return res.status(200).json({
        success: true,
        data: finalData,
        total
    })
}));
*/

routerBooks.get("/", validateQuery, asyncHandler(async (req, res) => {
    const {
        name,
        category,
        author,
        page = 1,
        limit = 25,
        sort = "created_at",
        order = "desc"
    } = req.query;
    const safeOrder = order === "asc" ? "asc" : "desc";
    const allowedSortFields = [
        "title",
        "published_year",
        "created_at",
        "rating_sum",
        "rating_count"
    ];
    const safeSort = allowedSortFields.includes(sort)
        ? sort
        : "created_at";

    const pageInt = parseInt(page, 10) || 1;
    const limitInt = parseInt(limit, 10) || 25;
    const whereClause = {
        ...(name && {
            title: {
                contains: name,
                mode: "insensitive"
            }
        }),
        ...(author && {
            book_authors: {
                some: {
                    authors: {
                        name: {
                            contains: author,
                            mode: "insensitive"
                        }
                    }
                }
            }
        }),
        ...(category && {
            book_categories: {
                some: {
                    categories: {
                        name: {
                            contains: category,
                            mode: "insensitive"
                        }
                    }
                }
            }
        })
    };
    const [books, total] = await Promise.all([
        prisma.books.findMany({
            where: whereClause,

            orderBy: {
                [safeSort]: safeOrder
            },

            skip: (pageInt - 1) * limitInt,
            take: limitInt,

            include: {
                book_authors: {
                    include: {
                        authors: true
                    }
                },

                book_categories: {
                    include: {
                        categories: true
                    }
                }
            }
        }),

        prisma.books.count({
            where: whereClause
        })
    ]);

    const finalData = books.map((b) => {
        const rating =
            b.rating_count > 0
                ? b.rating_sum / b.rating_count
                : 0;
        return {
            book_id: b.book_id,
            title: b.title,
            description: b.description,
            isbn: b.isbn,
            publisher: b.publisher,
            published_year: b.published_year,
            cover_url: b.cover_url,
            created_at: b.created_at,
            updated_at: b.updated_at,

            author: b.book_authors.map(
                (a) => a.authors.name
            ),

            category: b.book_categories.map(
                (c) => c.categories.name
            ),

            rating: Number(rating.toFixed(1)),
            rating_count: b.rating_count
        };
    });

    return res.status(200).json({
        success: true,
        data: finalData,
        total
    });
})
);


routerBooks.get("/", validateQuery, asyncHandler( async (req, res) => {
    const { name, author, category, page = 1, limit = 25, sort = "created_at", order = "desc" } = req.query;
    const safeOrder = order === "asc" ? "asc" : "desc";
    const allowedSortFields = [
        "title",
        "published_year",
        "created_at",
        "rating_sum",
        "rating_count",
        "rating_avg"
    ];
    const safeSort = allowedSortFields.includes(sort) ? sort : "created_at";
    const pageInt = parseInt(page, 10) || 1;
    const limitInt = parseInt(limit, 10) || 25;
    const whereClause = {
        ...(name && {
            title: {
                contains: name,
                mode: "insensitive"
            }
        }),
        ...(category && {
            book_categories: {
                some: {
                    categories: {
                        name: {
                            contains: category,
                            mode: "insensitive"
                        }
                    }
                }
            }
        }),
        ...(author && {
            book_authors: {
                some: {
                    authors: {
                        name: {
                            contains: author,
                            mode: "insensitive"
                        }
                    }
                }
            }
        })
    }
    const [ books, total ] = await Promise.all([
        prisma.books.findMany({
            where: whereClause,
            orderBy: {
                [safeSort]: safeOrder
            },
            skip: (pageInt - 1 ) * limitInt,
            take: limitInt,

            include: {
                book_categories: {
                    include: {
                        categories: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                book_authors: {
                    include: {
                        authors: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        }),
        prisma.books.count({
        where: whereClause
        })
    ])
    const finalData = books.map((book) => {
        return {
            book_id: book.book_id,
            title: book.title,
            description: book.description,
            isbn: book.isbn,
            publisher: book.publisher,
            published_year: book.published_year,
            cover_url: book.cover_url,
            created_at: book.created_at,
            updated_at: book.updated_at,
            category:  book.book_categories.map((category) => category.categories.name),
            author: book.book_authors.map((author) => author.authors.name),
            rating: book.rating_avg,
            rating_count: book.rating_count
        }
    })
    return res.status(200).json({
        success: true,
        data: finalData,
        total
    })
}))
    


routerBooks.post("/", postBookValidation, async (req, res) => {
    //1 access req and body
    const { 
        title, 
        description, 
        isbn, 
        publisher, 
        published_year, 
        cover_url, 
        author_ids, 
        category_ids 
    } = req.body;
    try {
        //2 sql statment
        const collision = await prisma.books.findUnique({
            where: { isbn: isbn }
        });
        if (collision) {
            return res.status(409).json({
                "success": false,
                "message": "เลข isbn " + collision.isbn + " มีอยู่ในระบบแล้ว"
            });
        }
        const result = await prisma.books.create(
            {
                data: {
                    title,
                    description,
                    isbn,
                    publisher,
                    published_year,
                    cover_url,
                    created_at: new Date(),
                    updated_at: new Date(),
                    // connect to book_author
                    book_authors: {
                        create: author_ids?.map((authorFromClient) => {
                            if (typeof authorFromClient === "number") {
                                return {
                                    authors: {
                                        connect: { author_id: authorFromClient }
                                    }
                                };
                            } else if (typeof authorFromClient === "string") {
                                return {
                                    authors: {
                                        connectOrCreate: {
                                            where: { name: authorFromClient },
                                            create: { name: authorFromClient }
                                        }
                                    }
                                };
                            }                           
                        }).filter(Boolean) || [],
                    },
                    book_categories: {
                        create: category_ids?.map((categoryFromClient) => {
                            if (typeof categoryFromClient === "number") {
                                return {
                                    categories: {
                                        connect: { category_id: categoryFromClient }
                                    }
                                };
                            } else if (typeof categoryFromClient === "string") {
                                return {
                                    categories: {
                                        connectOrCreate: {
                                            where: { name: categoryFromClient },
                                            create: { name: categoryFromClient }
                                        }
                                    }
                                };
                            }
                        }).filter(Boolean) || [],
                    }
                },
                include: {
                    book_authors: { include: { authors: true } },
                    book_categories: { include: { categories: true } }
                }
            }
        )
        //3 res section
        return res.status(201).json({
            "success": true,
            "message": "Add new book successfully",
            "newbook": result
        })
    } catch (error) {
        console.error("Error in POST /books:", error)
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again later."
        })
    }

});
routerBooks.put("/:bookId", postBookValidation, async (req, res) => {
    //1 access req
    const bookIdFromClient = req.params.bookId;
    const bookIdFromClientInt = parseInt(bookIdFromClient, 10);
    if (isNaN(bookIdFromClientInt)){
        return res.status(400).json({
            "success": false,
            "message": "รูปแบบข้อมูล bookId ไม่ถูกต้อง"
        });
    }
    const { 
        title, 
        description, 
        isbn, 
        publisher, 
        published_year, 
        cover_url, 
        author_ids, 
        category_ids 
    } = req.body;
    //2 sql
    try {
        const collision = await prisma.books.findFirst({
            where: {
                isbn: isbn,
                NOT: { book_id: bookIdFromClientInt }
            }
        });
        if (collision) {
            return res.status(409).json({
                "success": false,
                "message": "เลข isbn " + collision.isbn + " มีอยู่ในระบบแล้ว"
            });
        }
        const [ deleteAuthor, deleteCategory, updateBook ] = await prisma.$transaction([
            prisma.book_authors.deleteMany({
                where: { book_id: bookIdFromClientInt }
            }),
            prisma.book_categories.deleteMany({
                where: { book_id: bookIdFromClientInt }
            }),

            prisma.books.update({
                where: { book_id: bookIdFromClientInt },
                data: {
                    title,
                    description,
                    isbn,
                    publisher,
                    published_year,
                    cover_url,
                    updated_at: new Date(),
                    book_authors: {
                        create: author_ids?.map((authorFromClient) => {
                            if (typeof authorFromClient === "number") {
                                return {
                                    authors: {
                                        connect: { author_id: authorFromClient }
                                    }
                                }
                            } else if (typeof authorFromClient === "string") {
                                return {
                                    authors: {
                                        connectOrCreate: {
                                            where: { name: authorFromClient },
                                            create: { name: authorFromClient}
                                        }
                                    }
                                }
                            }
                        }).filter(Boolean) || [],
                    },
                    book_categories: {
                        create: category_ids?.map((categoryFromClient) => {
                            if (typeof categoryFromClient === "number") {
                                return {
                                    categories: {
                                        connect: { category_id: categoryFromClient }
                                    }
                                }
                            } else if (typeof categoryFromClient === "string") {
                                return {
                                    categories: {
                                        connectOrCreate: {
                                            where: { name: categoryFromClient },
                                            create: { name: categoryFromClient }
                                        }
                                    }
                                }
                            }
                        }).filter(Boolean) || [],
                    }
                },
                include: { 
                    book_authors: { include: { authors: true }},
                    book_categories: { include: { categories: true }}
                }
            })
        ])

        //3 res
            if (!updateBook) {
                return res.status(404).json({
                    "success": false,
                    "message": "Book not found"
                });
            }
        return res.status(200).json({
            "success": true,
            "message": "update book data successfully",
            "data": updateBook
        });
    } catch (error) {
                console.error("error: " + error);
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again later"
        })
    }
});
routerBooks.delete("/:bookId", async (req, res) => {
    //1 access request
    const bookIdFromClient = req.params.bookId;
    const bookIdFromClientInt = parseInt(bookIdFromClient, 10);
    if (isNaN(bookIdFromClientInt)) {
        return res.status(400).json({
            "success": false,
            "message": "รูปแบบข้อมูล book id ไม่ถูกต้อง"
        });
    }
    //2 sql
    try {
        const deleteTarget = await prisma.books.findUnique({
            where: { book_id: bookIdFromClientInt }
        });
        if (!deleteTarget) {
            return res.status(404).json({
                "success": false,
                "message": "ข้อมูล bookId ไม่ถูกต้อง"
            });
        }
        const result = await prisma.books.delete({
            where: { book_id: bookIdFromClientInt },
            include: {
                book_authors: true,
                book_categories: true 
            }
        });
        //3 response
        return res.status(200).json({
            "success": true,
            "message": "Delete book id: " + bookIdFromClientInt + " successfully",
            "data": result
        })
        } catch (error) {
            return res.status(500).json({
                "success": false,
                "message": " Internal server error. Please try again later"
            })
        }
});
export default routerBooks;