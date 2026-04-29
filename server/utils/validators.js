import AppError from "./AppError.js"

export function parsePositiveInt(value, fieldName = "value") {
    const num = parseInt(value, 10); 
    if (isNaN(num) || num <= 0) {
        throw new AppError(`${fieldName} ไม่ถูกต้อง`, 400);
    }
    return num;
}

export function parsePositiveIntArray(arr, fieldName) {
    if (!Array.isArray(arr)) {
        throw new AppError(`${fieldName} ต้องเป็น array`, 400);
    }
    const parsed = arr.map((item) => parsePositiveInt(item, fieldName));
    return parsed;
};

export function validateRequired(value, fieldName) {
    if (value === undefined || value === null || 
        (typeof value === "string" && value.trim() === "")
    ) {
        throw new AppError(`กรุณาระบุ ${fieldName}`, 400);
    }
}

export function validateStringLength(value, fieldName, min, max) {
    if (typeof value !== "string") {
        throw new AppError(`${fieldName} ต้องเป็น string`, 400);
    }
    if (value.length < min || value.length > max) {
        throw new AppError(`${fieldName} ต้องมี ${min}-${max} ตัวอักษร`, 400);
    }
}

export function validateEmail(value, fieldName = "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) { 
        throw new AppError(`${fieldName} รูปแบบไม่ถูกต้อง`, 400);
    }
}

export function validateUrl(value, fieldName = "url") {
    const urlRegex = /^https?:\/\/.+\..+/;
    if (!urlRegex.test(value)) {
        throw new AppError(`${fieldName} ต้องเป็น URL ที่ถูกต้อง`, 400);
    }
}