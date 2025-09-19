import { Router } from "express";
import { prisma } from "../prisma.js";
import { validateId, validateQuery, postCategoryValidation } from "../middleware/validateData.js";
import { protect } from "../middleware/protect.js"

const routerCategories = Router();
routerCategories.use(protect);

routerCategories.get("/:categoryId", validateId("categoryId"), async (req, res) => {
    //1 access request
    //2 sql
    const findId = {
        where: { category_id: req.params.categoryId },
        include: {
            other_categories: {
                select: { category_id: true, name: true }
            }
        }
    };
    try {
        const result = await prisma.categories.findUnique(findId);
        //3 response
        if (!result) {
            return res.status(404).json({
                "success": false,
                "message": "Category not found"
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
routerCategories.get("/", validateQuery, async (req, res) => {
    //1 access requset
    const { search, name, page, limit } = req.query;
    //2 sql
    let searchCondition = {};
    if (name) {
        searchCondition = {
            name: { contains: name, mode: "insensitive" }
        }
    }
    if (search) {
        searchCondition = {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } }
            ]
        }
    }
    let queryOption = { 
        where: searchCondition,
        include: {
            other_categories: {
                select: { category_id: true, name: true }
            }
        }
    };
    if (page !== undefined && limit !== undefined) {
        const pageInt = parseInt(page, 10);
        const limitInt = parseInt(limit, 10);
        queryOption.skip = (pageInt - 1) * limitInt;
        queryOption.take = limitInt;
    }
    try {
        const result = await prisma.categories.findMany(queryOption);
        const count = await prisma.categories.count({ where: searchCondition });
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
routerCategories.post("/", postCategoryValidation, async (req, res) => {
    //1 access request
    const { name, description, parent_category_id } = req.body
    //2 sql
    const parentCategoryIdInt = parseInt(parent_category_id, 10);
    if (isNaN(parentCategoryIdInt) || parentCategoryIdInt <= 0) {
        return res.status(400).json({
            "success": false,
            "message": "รูปแบบข้อมูล parent_category_id ไม่ถูกต้อง"
        });
    }
    const createCategory = {
        data: {
            name,
            description,
            parent_category_id: parentCategoryIdInt
        },
        include: {
            categories: {
                select: { category_id: true, name: true }
            }
        }
    }
    try {
        const collision = await prisma.categories.findUnique({
            where: { name }
        });
        if (collision) {
            return res.status(409).json({
                "success": false,
                "message": "ชื่อ category " + collision.name + " มีอยู่ในระบบแล้ว"
            })
        }
        const result = await prisma.categories.create(createCategory)
        //3 response
        return res.status(201).json({
            "success": true,
            "message": "Create category successfully",
            "data": result
        });
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again later"
        });
    }
});
routerCategories.put("/:categoryId", validateId("categoryId"), postCategoryValidation, async (req, res) => {
    //1 access request
    const { name, description, parent_category_id } = req.body;
    let parentId = null;
    try {
        if (parent_category_id !== undefined) {
            const parentCategoryIdInt = parseInt(parent_category_id, 10);
            if (isNaN(parentCategoryIdInt) || parentCategoryIdInt <= 0) {
                return res.status(400).json({
                    "success": false,
                    "message": "รูปแบบข้อมูล parent_category_id ไม่ถูกต้อง"
                });
            }
            if (parentCategoryIdInt === req.params.categoryId) {
                return res.status(400).json({
                    "success": false,
                    "message": "ข้อมูล parent_category_id ห้ามซ้ำกับ category_id"
                });
            }
            const parentExists = await prisma.categories.findUnique({
                where: { category_id: parentCategoryIdInt }
            })
            if (!parentExists) {
                return res.status(400).json({
                    "success": false,
                    "message": "ไม่พบข้อมูล parent_category_id"
                });
            }
            parentId = parentCategoryIdInt;
        }
    //2 sql
        const updateCategory = {
            where: {
                category_id: req.params.categoryId
            },
            data: {
                name,
                description,
                parent_category_id: parentId
            }
        }
        const checkCategory = await prisma.categories.findUnique({
            where: {
                category_id: req.params.categoryId
            }
        })
        if (!checkCategory) {
            return res.status(404).json({
                "success": false,
                "message": "Category not found"
            });
        }
        const collision = await prisma.categories.findFirst({
            where: {
                name,
                NOT: {
                    category_id: req.params.categoryId
                }
            }
        })
        if (collision) {
            return res.status(409).json({
                "success": false,
                "message": "ชื่อ category " + collision.name + " มีอยู่ในระบบแล้ว"
            });
        }
        const result = await prisma.categories.update(updateCategory)
        //3 response
        return res.status(200).json({
            "success": true,
            "message": "Update category successfully",
            "data": result
        });
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please again later"
        });
    }
});
routerCategories.delete("/:categoryId",validateId("categoryId"), async (req,res) => {
    //1 access requset
    //2 sql
    const deleteCategory = {
        where: { category_id: req.params.categoryId }
    }
    try {
        const deleteTarget = await prisma.categories.findUnique(deleteCategory)
        if (!deleteTarget) {
            return res.status(404).json({
                "success": false,
                "message": "Category not found"
            });
        }
        const result = await prisma.categories.delete(deleteCategory);
        //3 response
        return res.status(200).json({
            "success": true,
            "message": "Delete category successfully",
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

export default routerCategories;
