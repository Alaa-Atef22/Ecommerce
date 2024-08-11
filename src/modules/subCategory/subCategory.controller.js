
import subCategoryModel from "../../../db/models/subCategory.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import categoryModel from "../../../db/models/category.model.js";
import { AppError } from '../../utils/classError.js'
import cloudinary from './../../utils/cloudinary.js';
import { nanoid } from "nanoid";
import slugify from "slugify";

//create SubCategory
export const createSubCategory = asyncHandler(async (req , res , next) =>{
const {name } = req.body

const categoryExist = await categoryModel.findById(req.params.categoryId)
if(!categoryExist){return next(new AppError("category not exists",409))}

const SubCategoryExist = await subCategoryModel.findOne({ name: name.toLowerCase() })

if(SubCategoryExist){return next(new AppError("SubCategory already exists",409))}

if(!req.file){return next(new AppError("image is required",409))}

const customId= nanoid(5)
const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
    folder:`Ecommerce/categories/${categoryExist.customId}/subCategories/${customId}`
})

req.filePath=`Ecommerce/categories/${categoryExist.customId}/subCategories/${customId}`

const SubCategory = await subCategoryModel.create({
    name,
    slug:slugify(name,{
        replacement:"_",
        lower:true
    }),
    image:{secure_url,public_id},
    customId,
    category:req.params.categoryId,
    createdBy:req.user._id
})
req.data={
    model: subCategoryModel,
    id: SubCategory._id
}
return res.status(200).json({msg:'done',SubCategory})
    })

//update SubCategory
export const updateSubCategory = asyncHandler(async (req , res , next) =>{
    const {name , category} = req.body
    const {id} = req.params
    const categoryExist = await categoryModel.findById(category)
if(!categoryExist){return next(new AppError("category not exists",409))}

    const subCategory = await subCategoryModel.findOne({_id:id,createdBy:req.user._id})
    if(!subCategory){return next(new AppError("SubCategory not exists",404))}
    if(name){
        if( name.toLowerCase() === subCategory.name ){
            return next(new AppError("name should be different",400))
        } 
        if( await subCategoryModel.findOne({ name: name.toLowerCase() }) ){
            return next(new AppError("name already exist",409))
        } 
subCategory.name = name.toLowerCase()
subCategory.slug = slugify(name,{
    replacement:"_",
    lower:true
    })
}
if(req.file){
    await cloudinary.uploader.destroy(subCategory.image.public_id)
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
        folder:`Ecommerce/categories/${categoryExist.customId}/subCategories/${subCategory.customId}`
    })
    subCategory.image={secure_url,public_id}
}
await subCategory.save()
return res.status(200).json({msg:'done',subCategory})
})

//deleteSubCategory
export const deleteSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
        const subCategory = await subCategoryModel.findOne({ _id: id, createdBy: req.user._id });
        if (!subCategory) {
            return next(new AppError("subCategory not found or you don't have permission to delete it", 404));
        }
        await cloudinary.uploader.destroy(subCategory.image.public_id);
        await subCategoryModel.findByIdAndDelete(id);
        return res.status(200).json({ msg: 'subCategory deleted successfully' });
});

// getSubCategoryById
export const getSubCategoryById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const subCategory = await subCategoryModel.findOne({ _id: id }).populate([{
        path:"category",
        select:"name -_id "
    },{
        path:"createdBy",
        select:"name -_id "
    }]);;
    if (!subCategory) {
        return next(new AppError('subCategory not found', 404));
    }
    return res.status(200).json(subCategory);
});

// getAllSubCategory
export const getAllSubCategories = asyncHandler(async (req, res, next) => {
    const subcategories = await subCategoryModel.find({}).populate([{
        path:"category",
        select:"name -_id "
    },{
        path:"createdBy",
        select:"name -_id "
    }]);
    return res.status(200).json(subcategories);
});
