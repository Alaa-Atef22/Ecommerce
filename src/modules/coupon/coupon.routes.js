import express from 'express'
import * as PC from './coupon.controller.js'
import {multerHost, validExtensions} from './../../middleware/multer.js'
import {validation} from './../../middleware/validation.js'
import {auth} from './../../middleware/auth.js'
import * as PV from './coupon.validation.js'
import { systemRoles } from '../../utils/systemRoles.js'
const couponRouter= express.Router();


couponRouter.post ("/",
    multerHost(validExtensions.image).fields([
        {name:"image",maxCount:1},
        {name:"coverImages",maxCount:3},
    ]),
    validation(PV.createCoupon),
    auth([systemRoles.admin]),
    PC.createCoupon);

couponRouter.put ("/:id",
    multerHost(validExtensions.image).fields([
        {name:"image",maxCount:1},
        {name:"coverImages",maxCount:3},
    ]),
    validation(PV.updateCoupon),
    auth([systemRoles.admin]),
    PC.updateCoupon);

couponRouter.delete ("/deleteCoupon/:id",
    auth([systemRoles.admin]),
    PC.deleteCoupon);

couponRouter.get ("/:id",
    auth([systemRoles.admin]),
    PC.getCouponById);

couponRouter.get("/",
    auth(Object.values(systemRoles)),
    PC.getAllCoupons);

export default couponRouter;