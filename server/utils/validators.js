import AppError from "./AppError.js"

export function parsePositiveInt(value, fieldName = "value") {
    const num = parseInt(value, 10); 
    if (isNaN(num) || num <= 0) {
        throw new AppError(`${fieldName} ไม่ถูกต้อง`, 400);
    }
    return num;
}

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