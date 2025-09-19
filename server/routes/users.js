import { Router } from "express";
import { prisma } from "../prisma.js";
import { validateId, validateQuery, usernameValidation, passwordValidation, emailValidation } from "../middleware/validateData.js"
import bcrypt from "bcrypt";

const routerUsers = Router();

routerUsers.get("/:userId", validateId("userId"), async (req, res) => {
    //1 access request
    //2 sql
    const findId = {
        where: { user_id: req.params.userId }
    };
    try {
        const result = await prisma.users.findUnique(findId)
        //3 response
        if (!result) {
            return res.status(404).json({
                "success": false,
                "message": "User not found"
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
routerUsers.get("/", validateQuery, async (req, res) => {
    //1 access request
    const { username, page, limit } = req.query;
    //2 sql
    
    try {
        let searchCondition = {};
        if (username) {
            searchCondition = {
                username: { contains: username, mode: "insensitive" }
            }   
        }   
        let queryOption = {
            where: searchCondition
        };
        if (page !== undefined && limit !== undefined) {
            const pageInt = parseInt(page, 10);
            const limitInt = parseInt(limit, 10);
            queryOption.skip = (pageInt - 1) * limitInt;
            queryOption.take = limitInt;
        }
        const count = await prisma.users.count({ where: searchCondition });
        const result = await prisma.users.findMany(queryOption);
        //3 response
        return res.status(200).json({
            "success": true,
            "count": count,
            "data": result
        });
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again later."
        });
    }
});
routerUsers.patch("/updateusername/:userId", validateId("userId"), usernameValidation, async (req, res) => {
    //1 access request
    const username= req.body.username;
    //2 sql
    try {
        const checkTarget = await prisma.users.findUnique({
            where: { user_id: req.params.userId }
        });
        if (!checkTarget) {
            return res.status(404).json({
                "success": false,
                "message": "User not found"
            });
        }
        const collision = await prisma.users.findUnique({
            where: { username }
        });
        if (collision) {
            return res.status(409).json({
                "success": false,
                "message": "ชื่อ username " + collision.username + " มีอยู่ในระบบแล้ว"
            });
        }
        const updateUsername = {
            where: { user_id: req.params.userId },
            data: { username, updated_at: new Date() }
        };
        const result = await prisma.users.update(updateUsername);
        //3 response
        return res.status(200).json({
            "success": true,
            "message": "Update user successfully",
            "data": result
        });
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again later."
        });
    }
});
routerUsers.patch("/updatepassword/:userId", validateId("userId"), passwordValidation, async (req, res) => {
    //1 access request
    const { password, old_password } = req.body;
    //2 sql
    try {
        const checkTarget = await prisma.users.findUnique({
            where: { user_id: req.params.userId }
        });
        if (!checkTarget) {
            return res.status(404).json({
                "success": false,
                "message": "User not found"
            });
        }
        const isValidPassword = await bcrypt.compare(old_password, checkTarget.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({
                "success": false,
                "message": "ข้อมูล password ไม่ถูกต้อง"
            });
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt)
        const updatePassword = {
            where: { user_id: req.params.userId },
            data: { password_hash: passwordHash, updated_at: new Date() }
        };
        const result = await prisma.users.update(updatePassword);
        //3 response
        return res.status(200).json({
            "success": true,
            "message": "Update user successfully",
            "data": result
        });
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again later."
        });
    }
});
routerUsers.patch("/updateemail/:userId", validateId("userId"), emailValidation, async (req, res) => {
    //1 access request
    const email= req.body.email;
    //2 sql
    try {
        const checkTarget = await prisma.users.findUnique({
            where: { user_id: req.params.userId }
        });
        if (!checkTarget) {
            return res.status(404).json({
                "success": false,
                "message": "User not found"
            });
        }
        const collision = await prisma.users.findUnique({
            where: { email }
        });
        if (collision) {
            return res.status(409).json({
                "success": false,
                "message": "ชื่อ email " + collision.email + " มีอยู่ในระบบแล้ว"
            });
        }
        const updateEmail = {
            where: { user_id: req.params.userId },
            data: { email, updated_at: new Date() }
        };
        const result = await prisma.users.update(updateEmail);
        //3 response
        return res.status(200).json({
            "success": true,
            "message": "Update email successfully",
            "data": result
        });
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again later."
        });
    }
});
routerUsers.delete("/:userId", validateId("userId"), async (req, res) => {
    //1 access requset
    //2 sql
    const deleteUser = {
        where: { user_id: req.params.userId }
    }
    try {
        const deleteTarget = await prisma.users.findUnique(deleteUser)
        if (!deleteTarget) {
            return res.status(404).json({
                "success": false,
                "message": "User not found"
            });
        }
        const result = await prisma.users.delete(deleteUser);
        //3 response
        return res.status(200).json({
            "success": true,
            "message": "Delete user successfully",
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
export default routerUsers;