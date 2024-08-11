import express from 'express'
import * as PC from './wishList.controller.js'
import {validation} from './../../middleware/validation.js'
import {auth} from './../../middleware/auth.js'
import * as PV from './wishList.validation.js'
import { systemRoles } from '../../utils/systemRoles.js'
const wishListRouter= express.Router({mergeParams:true});


wishListRouter.post ("/",
    validation(PV.createWishList),
    auth(Object.values(systemRoles)),
    PC.createWishList);

wishListRouter.delete ("/",
    validation(PV.removeWishList),
    auth(Object.values(systemRoles)),
    PC.removeWishList);




export default wishListRouter;