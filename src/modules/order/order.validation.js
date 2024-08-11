
import { generalFiled } from "../../utils/generalFields.js";
import joi from "joi";


export const createOrder={
    body:joi.object({
        productId:generalFiled.id,
        quantity:joi.number().integer(),
        phone:joi.string().required(),
        address:joi.string().required(),
        couponCode:joi.string().min(3),
        paymentMethod:joi.string().valid("card","cash").required()
    
    }),
    headers: generalFiled.headers.required()
}
export const cancelOrder={
    body:joi.object({
        reason:joi.string().min(3),
    }),
    params: joi.object({
        id:generalFiled.id.required(),
    }).required(),
    headers: generalFiled.headers.required()
}


