import AppError from "../utils/AppError.js";
import { parsePositiveInt, parsePositiveIntArray, validateRequired, validateStringLength, validateEmail, validateUrl } from "../utils/validators.js";

//----------------------------- Data for every table--------------
export function validateId(paramName) {
    return (req, res, next) => {
        try {
            req.params[paramName] = parsePositiveInt(req.params[paramName], paramName);
            next();
        } catch (error) {
            next(error);
        }

    }
};

export const validateQuery = (req, res, next) => {
    try {
        const { page, limit} = req.query;

        if (page === undefined && limit === undefined) {
            return next();
        }
        if (page !== undefined) {
            req.query.page = parsePositiveInt(page, "page");
        }
        if (limit !== undefined) {
            const parsed = parsePositiveInt(limit, "limit");
            req.query.limit = Math.min(parsed, 500);
        }
        next();
    } catch (error) {
        next(error);
    }

};

export const userIdQueryValidation = (req, res, next) => {
    try {
        const { user_id }  = req.query;
        if (user_id) {
             req.query.user_id = parsePositiveInt(user_id, "user_id");
        }
        next();
    } catch (error) {
        next(error);
    }
}

export const userIdBodyValidation = (req, res, next) => {
    try {
        const { user_id }  = req.body;
        if (!user_id) {
            throw new AppError(`ข้อมูลที่ต้องการมีไม่ครบ`, 400);
        }
        req.body.user_id = parsePositiveInt(user_id, "user");
        next();
    } catch (error) {
        next(error);
    }
};
//-------------------------------- books validation -----------------------------------
export const postBookValidation = (req, res, next) => {
    try {
        const { title, published_year, cover_url, author_ids, category_ids } = req.body;
        validateRequired(title, "ชื่อหนังสือ");
        if (published_year) {
            req.body.published_year = parsePositiveInt(published_year, "published_year");
        }
        if (cover_url) {
            validateUrl(cover_url, "cover_url");
        }
        if (author_ids) {
            req.body.author_ids = parsePositiveIntArray(author_ids, "author_ids");
        }
        if (category_ids) {
            req.body.category_ids = parsePositiveIntArray(category_ids, "category_ids");
        }
        next();
    } catch(error) {
        next(error);
    }
}

//------------------------------authors table--------------------------
export const postAuthorValidation = (req, res, next) => {
    try {
        const { name } = req.body;
        validateRequired(name, "ชื่อผู้แต่ง");
        validateStringLength(name, "ชื่อผู้แต่ง", 4, 29);
        next();
    } catch (error) {
        next(error);
    }
}
//----------------------------------category table--------------------
export const postCategoryValidation = (req, res, next) => {
    try {
        const { name, description, parent_category_id } = req.body;
        validateRequired(name, "category name");
        validateStringLength(name, "category name", 3, 30);
        if (description !== undefined) {
            validateStringLength(description, "description", 0, 999);
        }
        if (parent_category_id !== undefined) {
            req.body.parent_category_id = parsePositiveInt(parent_category_id, "parent_category_id");
        }
        next();
    } catch (error) {
        next(error);
    }
}
//------------------------------------ users ---------------------------------------------
export const postUserValidation = (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        validateRequired(username, "username");
        validateRequired(email, "email");
        validateRequired(password, "password");
        validateStringLength(username, "username", 3, 20);
        validateStringLength(password, "password", 8, 40);
        validateEmail(email, "email");
        next()
    } catch (error) {
        next(error);
    }
};

export const loginValidation = (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            "success": false,
            "message": "ข้อมูลที่ต้องการมีไม่ครบ"
        });
    }
    next();
};
export const usernameValidation = (req, res, next) => {
    const username = req.body.username;
    if (!username) {
        return res.status(400).json({
            "success": false,
            "message": "ข้อมูลที่ต้องการมีไม่ครบ"
        });
    }
    if (username.length < 3 || username.length > 20 || typeof username !== 'string') {
        return res.status(400).json({
            "success": false,
            "message": "รูปแบบข้อมูลไม่ถูกต้อง"
        });
    }
    next();
};
export const passwordValidation = (req, res, next) => {
    const password = req.body.password;
    const old_password = req.body.old_password;
    if (!password || !old_password) {
        return res.status(400).json({
            "success": false,
            "message": "ข้อมูลที่ต้องการมีไม่ครบ"
        });
    }
    if (password.length < 8 || password.length > 40) {
        return res.status(400).json({
            "success": false,
            "message": "รูปแบบข้อมูลไม่ถูกต้อง"
        });
    }
    if (old_password.length < 8 || old_password.length > 40) {
        return res.status(400).json({
            "success": false,
            "message": "รูปแบบข้อมูลไม่ถูกต้อง"
        });
    }
    next();
};
export const emailValidation = (req, res, next) => {
    const email = req.body.email;
    if (!email) {
        return res.status(400).json({
            "success": false,
            "message": "ข้อมูลที่ต้องการมีไม่ครบ"
        });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            "success": false,
            "message": "รูปแบบ email ไม่ถูกต้อง"
        });
    }
    next();
};
//=========================================== review =======================================

export const reviewValidation = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success:false,
            message:"Unauthorized"
        });
    }

    const { book_id, rating, comment } = req.body;

    if (
        book_id === undefined ||
        rating === undefined ||
        comment === undefined ||
        comment.trim() === ""
    ) {
        return res.status(400).json({
            success: false,
            message: "ข้อมูลที่ต้องการมีไม่ครบ"
        });
    }

    const userIdInt = parseInt(req.user.user_id, 10);
    const bookIdInt = parseInt(book_id,10);
    const ratingInt = parseInt(rating, 10);

    if (isNaN(userIdInt) || userIdInt < 0) {
        return res.status(400).json({
            success:false,
            message:"User auth invalid"
        });
    }

    if (isNaN(bookIdInt) || bookIdInt < 0) {
        return res.status(400).json({
            success:false,
            message:"ข้อมูล book ไม่ถูกต้อง"
        });
    }

    if (isNaN(ratingInt) || ratingInt < 1 || ratingInt > 5) {
        return res.status(400).json({
            success:false,
            message:"คะแนนรีวิว ต้องเป็นเลข 1-5"
        });
    }

    next();
};

export const reviewUpdateValidation = (req, res, next) => {
    const { rating, comment } = req.body;
    const ratingInt = parseInt(rating, 10)
    if (isNaN(ratingInt) || !ratingInt || ratingInt < 1 || ratingInt > 5) {
        return res.status(400).json({
            "success": false,
            "message": "คะแนนรีวิว ต้องเป็นเลข 1-5"
        });
    }
    if (!comment) {
        return res.status(400).json({
            "success": false,
            "message": "ข้อมูลที่ต้องการมีไม่ครบ"
        });
    }
    next();
};

//==================================user_books=====================
export const userBookValidation = (req, res, next) => {
    const { user_id, book_id, status } = req.body;
    const userIdInt = parseInt(user_id, 10);
    const bookIdInt = parseInt(book_id,10);
    if (!user_id || !book_id || !status) {
        return res.status(400).json({
            "success": false,
            "message": "ข้อมูลที่ต้องการมีไม่ครบ"
        });
    }
    if (isNaN(userIdInt) || userIdInt < 0) {
        return res.status(400).json({
            "success": false,
            "message": "ข้อมูล user ไม่ถูกต้อง"
        });
    }
    if (isNaN(bookIdInt) || bookIdInt < 0) {
        return res.status(400).json({
            "success": false,
            "message": "ข้อมูล book ไม่ถูกต้อง"
        });
    }
    if (status != "want_to_read" && status != "reading" && status != "read") {
        return res.status(400).json({
            "success": false,
            "message": "กำหนดค่า status: want_to_read, reading, หรือ read"
        });
    }
    next();
};
export const userBookStatusValidation = (req, res, next) => {
    const status = req.body.status;
    if (status != "want_to_read" && status != "reading" && status != "read") {
        return res.status(400).json({
            "success": false,
            "message": "กำหนดค่า status: want_to_read, reading, หรือ read"
        });
    }
    next();
};

//===================== custom collections =======================
export const nameBodyValidation = (req, res, next) => {
    const { name } = req.body;
    if (name.length < 1 || name.length > 100) {
        return res.status(400).json({
            "success": false,
            "message": "ข้อมูล name ต้องมี 1-100ตัวอักษร"
        });
    }
    next();
};
export const descriptionBodyValidation = (req, res, next) => {
    const { description } = req.body;
    if (description.length < 1) {
        return res.status(400).json({
            "success": false,
            "message": "ข้อมูล description สั้นเกินไป"
        });
    }
    next();
}

//================================ user profile =============================
export const firstNameValidation = (req, res, next) => {
    const first_name = req.body.first_name;
    if (!first_name) {
        return res.status(400).json({
            "success": false,
            "message": "กรุณาใส่ข้อมูล First name"
        });
    }
    if (first_name.length < 2 || first_name.length > 50) {
        return res.status(400).json({
            "success": false,
            "message": "กรุณาใส่ข้อมูล First name 2-50 ตัวอักษร"
        });
    }
    next();
}
export const lastNameValidation = (req, res, next) => {
    const last_name = req.body.last_name;
    if (!last_name) {
        return res.status(400).json({
            "success": false,
            "message": "กรุณาใส่ข้อมูล Last_name"
        });
    }
    if (last_name.length < 2 || last_name.length > 50) {
        return res.status(400).json({
            "success": false,
            "message": "กรุณาใส่ข้อมูล Last_name 2-50 ตัวอักษร"
        });
    }
    next();
}
