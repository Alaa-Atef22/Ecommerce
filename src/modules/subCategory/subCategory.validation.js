
import { generalFiled } from "../../utils/generalFields.js";
import joi from "joi";

export const createSubCategory={
    body:joi.object({
    name:joi.string().min(3).max(30).required(),
    }).required(),
    file: generalFiled.file.required(),
    params:joi.object({
        categoryId: generalFiled.id.required()
    }),
    headers: generalFiled.headers.required()
}

export const updateSubCategory={
    body:joi.object({
    name:joi.string().min(3).max(30),
    category:generalFiled.id.required()
    }).required(),
    file: generalFiled.file,
    headers: generalFiled.headers.required()
}