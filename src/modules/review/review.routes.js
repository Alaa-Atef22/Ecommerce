import express from 'express'
import * as PC from './review.controller.js'
import {validation} from './../../middleware/validation.js'
import {auth} from './../../middleware/auth.js'
import * as PV from './review.validation.js'
import { systemRoles } from '../../utils/systemRoles.js'
const reviewRouter= express.Router({mergeParams:true});


reviewRouter.post ("/",
    validation(PV.createReview),
    auth([systemRoles.admin]),
    PC.createReview);

reviewRouter.delete ("/:id",
    validation(PV.deleteReview),
    auth([systemRoles.admin]),
    PC.deleteReview);



export default reviewRouter;