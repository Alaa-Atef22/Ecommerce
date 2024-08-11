import express from 'express'
import * as PC from './cart.controller.js'
import {validation} from './../../middleware/validation.js'
import {auth} from './../../middleware/auth.js'
import * as PV from './cart.validation.js'
import { systemRoles } from '../../utils/systemRoles.js'
const cartRouter= express.Router();


cartRouter.post ("/",
    validation(PV.createCart),
    auth([systemRoles.admin]),
    PC.createCart);


cartRouter.patch ("/",
    validation(PV.removeCart),
    auth([systemRoles.admin]),
    PC.removeCart);

cartRouter.put ("/",
    validation(PV.clearCart),
    auth([systemRoles.admin]),
    PC.clearCart);


export default cartRouter;