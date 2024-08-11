import express from 'express'
import * as CC from './category.controller.js'
import {multerHost, validExtensions} from './../../middleware/multer.js'
import {validation} from './../../middleware/validation.js'
import {auth} from './../../middleware/auth.js'
import * as CV from './category.validation.js'
import subCategoryRouter from '../subCategory/subCategory.routes.js'
import { systemRoles } from '../../utils/systemRoles.js'
const categoryRouter= express.Router();


categoryRouter.use("/:categoryId/subCategories",subCategoryRouter)


categoryRouter.post ("/",
    multerHost(validExtensions.image).single("image"),
    validation(CV.createCategory),
    auth([systemRoles.admin]),
    CC.createCategory);
categoryRouter.put ("/:id",
    multerHost(validExtensions.image).single("image"),
    validation(CV.updateCategory),
    auth([systemRoles.admin]),
    CC.updateCategory);

categoryRouter.delete ("/deleteCategory/:id",
    auth([systemRoles.admin]),
    CC.deleteCategory);

categoryRouter.get ("/:id",
    auth([systemRoles.admin]),
    CC.getCategoryById);

categoryRouter.get("/",
    auth(Object.values(systemRoles)),
    CC.getAllCategories);

export default categoryRouter;