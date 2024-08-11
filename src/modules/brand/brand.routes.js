import express from 'express'
import * as BC from './brand.controller.js'
import {multerHost, validExtensions} from './../../middleware/multer.js'
import {validation} from './../../middleware/validation.js'
import {auth} from './../../middleware/auth.js'
import * as BV from './brand.validation.js'
import { systemRoles } from '../../utils/systemRoles.js'
const brandRouter= express.Router();



brandRouter.post ("/",
    multerHost(validExtensions.image).single("image"),
    validation(BV.createBrand),
    auth([systemRoles.admin]),
    BC.createBrand);

brandRouter.put ("/:id",
    multerHost(validExtensions.image).single("image"),
    validation(BV.updateBrand),
    auth([systemRoles.admin]),
    BC.updateBrand);

brandRouter.delete ("/:id",
    auth([systemRoles.admin]),
    BC.deleteBrand);

brandRouter.get ("/:id",
    auth([systemRoles.admin]),
    BC.getBrandById);

brandRouter.get ("/",
    auth(Object.values(systemRoles)),
    BC.getAllBrands);

export default brandRouter;