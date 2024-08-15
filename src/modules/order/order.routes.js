import express from 'express'
import * as PC from './order.controller.js'
import {validation} from './../../middleware/validation.js'
import {auth} from './../../middleware/auth.js'
import * as PV from './order.validation.js'
import { systemRoles } from '../../utils/systemRoles.js'
const orderRouter= express.Router();


orderRouter.post ("/",
    validation(PV.createOrder),
    auth([systemRoles.admin]),
    PC.createOrder);

orderRouter.put ("/:id",
    validation(PV.cancelOrder),
    auth([systemRoles.admin]),
    PC.cancelOrder);


    orderRouter.post('/webhook',express.raw({type: 'application/json'}),PC.webhook);



export default orderRouter;