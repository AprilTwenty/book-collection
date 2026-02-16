
//----------------------------- Data for every table--------------
export function validateId(paramName) {
    return (req, res, next) => {
        const idFromClient = req.params[paramName];
        const idInt = parseInt(idFromClient, 10)
        if (isNaN(idInt) || idInt <= 0) {
            return res.status(400).json({
                "success": false,
                "message": "รูปแบบข้อมูล " + paramName + " ไม่ถูกต้อง"
            });
        }
        req.params[paramName] = idInt;
        next();
    }
};

export const validateQuery = (req, res, next) => {
    const { page, limit} = req.query;
    if (page === undefined && limit === undefined) {
        return next();
    }
    if (page !== undefined) {
        const pageInt = parseInt(page, 10);
        if (isNaN(pageInt) || pageInt <= 0) {
            return res.status(400).json({
                "success": false,
                "message": "รูปแบบข้อมูล page ไม่ถูกต้อง"
            });
        }
        req.query.page = pageInt;
    }
    if (limit !== undefined) {
        const limitInt = parseInt(limit, 10);
        if (isNaN(limitInt) || limitInt <= 0) {
            return res.status(400).json({
                "success": false,
                "message": "รูปแบบข้อมูล limit ไม่ถูกต้อง"
            });
        }
        req.query.limit = limitInt;
    }
    next();
}
export const userIdQueryValidation = (req, res, next) => {
        const { user_id }  = req.query;
        if (user_id) {
            const userIdInt = parseInt(user_id, 10);
            if (isNaN(userIdInt) || userIdInt < 1) {
                return res.status(400).json({
                    "success": false,
                    "message": "ข้อมูล user ไม่ถูกต้อง"
                });
            }
        }
    next();
};
export const userIdBodyValidation = (req, res, next) => {
        const { user_id }  = req.body;
        const userIdInt = parseInt(user_id, 10);
        if (!user_id) {
            return res.status(400).json({
                "success": false,
                "message": "ข้อมูลที่ต้องการมีไม่ครบ"
            });
        }
        if (isNaN(userIdInt) || userIdInt < 1) {
            return res.status(400).json({
                "success": false,
                "message": "ข้อมูล user ไม่ถูกต้อง"
            });
        }
    next();
};
//-------------------------------- books validation -----------------------------------
export const postBookValidation = (req, res, next) => {
    const { title, description, isbn, publisher, published_year, cover_url, author_ids, category_ids } = req.body;

    if (!title) {
        return res.status(400).json({
            "success": false,
            "message": "Missing required fields: title"
        });
    }
    if (published_year && isNaN(Number(published_year))) {
        return res.status(400).json({
            "success": false,
            "message": "published_year must be a valid number"
        });
    }
    if (cover_url && !/^https?:\/\/.+\..+/.test(cover_url)) {
        return res.status(400).json({
            "success": false,
            "message": "cover_url must be a valid URL"
        });
    }
    if (author_ids && !Array.isArray(author_ids)) {
        return res.status(400).json({
            "success": false,
            "message": "author_ids must be array"
        });
    }
    if (category_ids && !Array.isArray(category_ids)) {
        return res.status(400).json({
            "success": false,
            "message": "category_ids must be array"
        });
    }
    next();
}
//------------------------------authors table--------------------------
export const postAuthorValidation = (req, res, next) => {
    const { name, bio } = req.body;
    if (!name) {
        return res.status(400).json({
            "success": false,
            "message": "ข้อมูลที่ต้องระบุ มีไม่ครบ"
        });
    }
    if (name.length <= 3 || name.length >= 30 || typeof name !== 'string') {
        return res.status(400).json({
            "success": false,
            "message": "รูปแบบข้อมูลไม่ถูกต้อง"
        });
    }
    next();
}
//----------------------------------category table--------------------
export const postCategoryValidation = (req, res, next) => {
    const { name, description, parent_category_id } = req.body;
    if (!name) {
        return res.status(400).json({
            "success": false,
            "message": "ข้อมูลที่ต้องระบุ มีไม่ครบ"
        });
    }
    if (name.length < 3 || name.length > 30 || typeof name !== 'string') {
        return res.status(400).json({
            "success": false,
            "message": "รูปแบบข้อมูลไม่ถูกต้อง"
        });
    }
    if (description !== undefined && description.length >= 1000) {
        return res.status(400).json({
            "success": false,
            "message": "ข้อความ description ยาวเกินที่กำหนด 1000 ตัวอักษร"
        });
    }
    next();
}
//------------------------------------ users ---------------------------------------------
export const postUserValidation = (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
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
    if (password.length < 8 || password.length > 40) {
        return res.status(400).json({
            "success": false,
            "message": "รูปแบบข้อมูลไม่ถูกต้อง"
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
