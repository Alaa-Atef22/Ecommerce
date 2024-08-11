
import { generalFiled } from "../../utils/generalFields.js";
import joi from "joi";

export const createBrand={
    body:joi.object({
    name:joi.string().min(3).max(30).required()
    }).required(),
    file: generalFiled.file.required(),
    headers: generalFiled.headers.required()
}


export const updateBrand={
    body:joi.object({
    name:joi.string().min(3).max(30),
    }).required(),
    file: generalFiled.file,
    headers: generalFiled.headers.required()
}