import { Router } from "express";
import { prisma } from "../prisma.js";
import { userIdBodyValidation, validateId, firstNameValidation, lastNameValidation } from "../middleware/validateData.js";
import { protect } from "../middleware/protect.js";

const routerUserProfile = Router();

routerUserProfile.post("/", protect, userIdBodyValidation, firstNameValidation, lastNameValidation, async (req, res) => {
    //1 access request
    const { user_id, first_name, last_name, bio, avatar_url } = req.body;
    const userIdFromTokenInt = parseInt(req.user.user_id, 10);
    const userIdInt = parseInt(user_id, 10);
    try {
        if (userIdFromTokenInt !== userIdInt) {
            return res.status(403).json({
                "success": false,
                "message": "User ID mismatch: Access denied"
            });
        }
        //2 sql
        const existingProfile = await prisma.user_profile.findUnique({ where: { user_id: userIdInt } });
        if (existingProfile) {
            return res.status(409).json({
                "success": false,
                "message": "Userprofile already exist"
            });
        }
        const createProfile = {
            data: {
                user_id: userIdInt,
                first_name,
                last_name,
                bio,
                avatar_url
            }
        };
        const result = await prisma.user_profile.create(createProfile);
        //3 response
        return res.status(201).json({
            "success": true,
            "message": "Create profile successfully",
            "data": result
        });
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again later"
        });
    }
});
routerUserProfile.patch("/:userId", protect, firstNameValidation, lastNameValidation, validateId("userId"), async (req, res) => {
    //1 access request
    const { first_name, last_name, bio, avatar_url } = req.body;
    const userIdFromTokenInt = parseInt(req.user.user_id, 10);
    //2 sql
    try {
        if (userIdFromTokenInt !== req.params.userId) {
            return res.status(403).json({
                "success": false,
                "message": "User ID mismatch: Access denied"
            });
        }
        const checkTarget = await prisma.user_profile.findUnique({
            where: { user_id: req.params.userId }
        });
        if (!checkTarget) {
            return res.status(404).json({
                "success": false,
                "message": "Userprofile not found"
            });
        }
        const updateProfile = {
            where: { user_id: req.params.userId },
            data: {
                first_name,
                last_name,
                bio,
                avatar_url
            }
        };
        const result = await prisma.user_profile.update(updateProfile);
        //3 response
        return res.status(200).json({
            "success": true,
            "message": "Update profile successfully",
            "data": result
        });
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again later."
        });
    }
});
routerUserProfile.get("/:userId", validateId("userId"), async (req, res) => {
    //1 access request
    //2 sql
    const findId = {
        where: { user_id: req.params.userId },
    };
    try {
        const result = await prisma.user_profile.findUnique(findId);
        //3 response
        if (!result) {
            return res.status(404).json({
                "success": false,
                "message": "Profile not found"
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
routerUserProfile.delete("/:userId", protect, validateId("userId"), async (req, res) => {
    const userIdFromTokenInt = parseInt(req.user.user_id, 10);
    try {
        if (userIdFromTokenInt !== req.params.userId) {
            return res.status(403).json({
                "success": false,
                "message": "User ID mismatch: Access denied"
            });
        }
        //2 sql
        const user = await prisma.user_profile.findFirst({ where: { user_id: userIdFromTokenInt } });
        if (!user) {
            return res.status(404).json({
                "success": false,
                "message": "Profile not found"
            });
        }
        const result = await prisma.user_profile.delete({
                where: { user_id: userIdFromTokenInt }
        });
        //3 response
        return res.status(200).json({
            "success": true,
            "message": "Delete profile successfully",
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
export default routerUserProfile;