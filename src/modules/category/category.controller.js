
import categoryModel from "../../../db/models/category.model.js";
import subCategoryModel from "../../../db/models/subCategory.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from '../../utils/classError.js'
import cloudinary from './../../utils/cloudinary.js';
import { nanoid } from "nanoid";
import slugify from "slugify";

//createCategory
export const createCategory = asyncHandler(async (req , res , next) =>{
const {name } = req.body
const categoryExist = await categoryModel.findOne({ name: name.toLowerCase() })
if(categoryExist){return next(new AppError("category already exists",409))}
if(!req.file){return next(new AppError("image is required",409))}
const customId= nanoid(5)
const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
    folder:`Ecommerce/categories/${customId}`
})
    
req.filePath= `Ecommerce/categories/${customId}`

const category = await categoryModel.create({
    name,
    slug:slugify(name,{
        replacement:"_",
        lower:true
    }),
    image:{secure_url,public_id},
    customId,
    createdBy:req.user._id
})

req.data={
    model: categoryModel,
    id: category._id
}

return res.status(200).json({msg:'done',category})
    })

//updateCategory
export const updateCategory = asyncHandler(async (req , res , next) =>{
    const {name } = req.body
    const {id} = req.params
    const category = await categoryModel.findOne({_id:id,createdBy:req.user._id})
    if(!category){return next(new AppError("category not exists",404))}
    if(name){
        if( name.toLowerCase() === category.name ){
            return next(new AppError("name should be different",400))
        } 
        if( await categoryModel.findOne({ name: name.toLowerCase() }) ){
            return next(new AppError("name already exist",409))
        } 
category.name = name.toLowerCase()
category.slug = slugify(name,{
    replacement:"_",
    lower:true
    })
}
if(req.file){
    await cloudinary.uploader.destroy(category.image.public_id)
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
        folder:`Ecommerce/categories/${category.customId}`
    })
    category.image={secure_url,public_id}
}
await category.save()
return res.status(200).json({msg:'done',category})
})
// delete Category
export const deleteCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
        const category = await categoryModel.findByIdAndDelete({ _id: id, createdBy: req.user._id });
        if (!category) {
            return next(new AppError("Category not found or you don't have permission to delete it", 404));
        }
        await subCategoryModel.deleteMany({category: category._id});
        await cloudinary.api.delete_resources_by_prefix(`Ecommerce/categories/${category.customId}`)
        await cloudinary.api.delete_folder(`Ecommerce/categories/${category.customId}`)
        return res.status(200).json({ msg: 'Category deleted successfully' });
});

// getCategoryById
export const getCategoryById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const category = await categoryModel.findOne({ _id: id }).populate([{path:"subCategories"}]);
    if (!category) {
        return next(new AppError('Category not found', 404));
    }
    return res.status(200).json(category);
});

// getAllCategory
export const getAllCategories = asyncHandler(async (req, res, next) => {
    const categories = await categoryModel.find({}).populate([{path:"subCategories"},{
        path:"createdBy",
        select:"name -_id "
    }]);
res.status(200).json({categories});
});
