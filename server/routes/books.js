import { Router } from "express";
import { postBookValidation, validateQuery } from "../middleware/validateData.js";
import { prisma } from "../app.js";

const routerBooks = Router();

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
    const result = await prisma.books.findUnique({
        where: {book_id: bookIdFromClientInt},
        include: { 
            book_authors: {include: { authors: true }},
            book_categories: {include: { categories: true }}
         }
    });
    //3 res section
    if (!result) {
        return res.status(404).json({
            "success": false,
            "message": "Book not found"
        });
    }
    const simpleResult = {
        "book_id": result.book_id,
        "title": result.title,
        "description": result.description,
        "isbn": result.isbn,
        "publisher": result.publisher,
        "published_year": result.published_year,
        "cover_url": result.cover_url,
        "created_at": result.created_at,
        "updated_at": result.updated_at,
        "author": result.book_authors.map((arr_author) => {
            return arr_author.authors.name}),
        "category": result.book_categories.map((arr_category) => {
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
routerBooks.get("/", validateQuery, async(req, res) => {
    //1 access req
    const { name, category, author, page, limit } = req.query;
    let filters = {};
    if (name) {
        filters.title = { contains: name, mode: "insensitive" }
    };
    if (author) {
        filters.book_authors = {
            some: {
                authors: { name: { contains : author, mode: "insensitive" }}
            }
        }
    }
    if (category) {
        filters.book_categories = {
            some: {
                categories: {  name: { contains: category, mode: "insensitive" }}
            }
        }
    }
    let queryOption = { where: filters };
    if (page !== undefined && limit !== undefined) {
        const pageInt = parseInt(page, 10);
        const limitInt = parseInt(limit, 10);
        queryOption.skip = (pageInt -1) * limitInt;
        queryOption.take = limitInt;
    }
    //2 sql
    try {
        queryOption.include = {
                book_authors: { include: { authors: true }},
                book_categories: { include: { categories: true }}
            };
        const result = await prisma.books.findMany(queryOption)
        //3 res
        const simpleResult = result.map((data) => {
            return {
            "book_id": data.book_id,
            "title": data.title,
            "description": data.description,
            "isbn": data.isbn,
            "publisher": data.publisher,
            "published_year": data.published_year,
            "cover_url": data.cover_url,
            "created_at": data.created_at,
            "updated_at": data.updated_at,
            "author": data.book_authors.map((arr_author) => {
                return arr_author.authors.name}),
            "category": data.book_categories.map((arr_category) => {
                return arr_category.categories.name})
        }
        });
        return res.status(200).json({
            "success": true,
            "data": simpleResult
        });
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again later."
        });
    }

});
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