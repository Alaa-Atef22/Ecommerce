import brandModel from "../../../db/models/brand.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from '../../utils/classError.js'
import cloudinary from './../../utils/cloudinary.js';
import { nanoid } from "nanoid";
import slugify from "slugify";

//create brand
export const createBrand = asyncHandler(async (req , res , next) =>{
const {name } = req.body

const brandExist = await brandModel.findOne({ name: name.toLowerCase() })

if(brandExist){return next(new AppError("brand already exists",409))}

if(!req.file){return next(new AppError("image is required",409))}

const customId= nanoid(5)
const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
    folder:`Ecommerce/Brands/${customId}`
})

req.filePath=`Ecommerce/Brands/${customId}`

const brand = await brandModel.create({
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
    model: brandModel,
    id: brand._id
}
return res.status(200).json({msg:'done',brand})
    })

//update brand
export const updateBrand = asyncHandler(async (req , res , next) =>{
    const {name } = req.body
    const {id} = req.params
    const brand = await brandModel.findOne({_id:id,createdBy:req.user._id})
    if(!brand){return next(new AppError("brand not exists",404))}
    if(name){
        if( name.toLowerCase() === brand.name ){
            return next(new AppError("name should be different",400))
        } 
        if( await brandModel.findOne({ name: name.toLowerCase() }) ){
            return next(new AppError("name already exist",409))
        } 
brand.name = name.toLowerCase()
brand.slug = slugify(name,{
    replacement:"_",
    lower:true
    })
}
if(req.file){
    await cloudinary.uploader.destroy(brand.image.public_id)
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
        folder:`Ecommerce/Brands/${brand.customId}`
    })
    brand.image={secure_url,public_id}
}
await brand.save()
return res.status(200).json({msg:'done',brand})
})

//deleteBrand
export const deleteBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
        const brand = await brandModel.findOne({ _id: id, createdBy: req.user._id });
        if (!brand) {
            return next(new AppError("brand not found or you don't have permission to delete it", 404));
        }
        await cloudinary.uploader.destroy(brand.image.public_id);
        await brandModel.findByIdAndDelete(id);
        return res.status(200).json({ msg: 'brand deleted successfully' });
});

// getBrandById
export const getBrandById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const brand = await brandModel.findOne({ _id: id });
    if (!brand) {
        return next(new AppError('brand not found', 404));
    }
    return res.status(200).json(brand);
});

// getAllbrand
export const getAllBrands = asyncHandler(async (req, res, next) => {
    const Brands = await brandModel.find();
    return res.status(200).json(Brands);
});
