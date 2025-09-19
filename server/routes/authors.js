import { Router } from "express";
import { prisma } from "../prisma.js";
import { postAuthorValidation, validateId, validateQuery } from "../middleware/validateData.js";
import { protect } from "../middleware/protect.js"

const routerAuthors = Router();
routerAuthors.use(protect);

routerAuthors.get("/:authorId", validateId("authorId"), async (req, res) => {
    //1 access request
    //2 sql
    try {
        const result = await prisma.authors.findUnique({
            where: { author_id: req.params.authorId }
        });
        //3 response
        if (!result) {
            return res.status(404).json({
                "success": false,
                "message": "Author not found"
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
})
routerAuthors.get("/", validateQuery, async (req, res) => {
    //1 access request
    const { search, name, page, limit } = req.query;

    let searchCondition = {};
    if (name) {
        searchCondition = {
            name: { contains: name, mode: "insensitive" }
        }
    } else if (search) {
        searchCondition = {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { bio: { contains: search, mode: "insensitive" } }
            ]
        }
    }
    let queryOption = { where: searchCondition };
    if (page !== undefined && limit !== undefined) {
        const pageInt = parseInt(page, 10);
        const limitInt = parseInt(limit, 10);
        queryOption.skip = (pageInt -1) * limitInt;
        queryOption.take = limitInt;
    }
    //2 sql
    try {
        const result = await prisma.authors.findMany(queryOption);
        const count = await prisma.authors.count({ where: searchCondition })
        //3 response
        return res.status(200).json({
            "success": true,
            "count": count,
            "data": result
        })        
    } catch (error) {
        console.error("Error fetching authors: ", error);
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again later"
        });
    }
});
routerAuthors.post("/", postAuthorValidation, async (req, res) => {
    //1 access request
    const { name, bio } = req.body;
    const createAuthor = {
        data: {
            name,
            bio
        }
    };
    //2 sql
    try {
        const result = await prisma.authors.create(createAuthor);
        //3 response
        return res.status(201).json({
            "success": true,
            "message": "Add new author successfully",
            "data": result
        });
    } catch (error) {
        console.error("error on" + error);
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again later"
        });
    }
});
routerAuthors.put("/:authorId", validateId("authorId"), postAuthorValidation, async (req, res) => {
    //1 access request
    const { name, bio } = req.body;
    //extra validate
    const checkAuthor = await prisma.authors.findUnique({
        where: { author_id: req.params.authorId }
    });
    if (!checkAuthor) {
        return res.status(404).json({
            "success": false,
            "message": "Author not found"
    });
    }
    const collision = await prisma.authors.findFirst({
        where: {
            name,
            NOT: { author_id: req.params.authorId }
        }
    });
    if (collision) {
        return res.status(409).json({
            "success": false,
            "message": "ชื่อ author " + collision.name + " มีอยู่ในระบบแล้ว"
        });
    }
    const updateAuthor = {
        where: { author_id: req.params.authorId },
        data: {
            name,
            bio
        }
    }
    //2 sql
    try {
        const result = await prisma.authors.update(updateAuthor);
        //3 response
        return res.status(200).json({
            "success": true,
            "message": "Update author successfully",
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
routerAuthors.delete("/:authorId", validateId("authorId"), async (req, res) => {
    //1 access request
    const deleteAuthor = {
        where: { author_id: req.params.authorId }
    };
    //2 sql
    const deleteTarget = await prisma.authors.findUnique(deleteAuthor);
    if (!deleteTarget) {
        return res.status(404).json({
            "success": false,
            "message": "ข้อมูล authorId ไม่ถูกต้อง"
        });
    }
    try {
        const result = await prisma.authors.delete(deleteAuthor)
        //3 response
        return res.status(200).json({
            "success": true,
            "message": "Delete author successfully",
            "data": result
        });
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please again later"
        });
    }
});
export default routerAuthors;