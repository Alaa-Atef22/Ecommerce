import wishListModel from "../../../db/models/wishList.model.js";
import productModel from "../../../db/models/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";

//createWishList
export const createWishList = asyncHandler(async (req, res, next) => {
const { productId }= req.params

const product = await productModel.findById({_id: productId })
if(!product){
  return next(new AppError("product not found",404))
}

const wishList = await wishListModel.findOne({user: req.user._id})
if(!wishList){
const newWishList= await wishListModel.create({
  user: req.user._id,
  products :[productId]
})
return res.status(200).json({ msg: "done", wishList: newWishList});
}
const newWishList= await wishListModel.findOneAndUpdate({user: req.user._id},{
    $addToSet:{ products:productId }
  },{new:true})
  res.status(201).json({ msg: "done", newWishList});
});

// removeWishList
export const removeWishList = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const product = await productModel.findById({ _id: productId });
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  const wishList = await wishListModel.findOne({ user: req.user._id });
  if (!wishList) {
    return next(new AppError("Wishlist not found", 404));
  }
  const updatedWishList = await wishListModel.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { products: productId } },
    { new: true }
  );
  if (updatedWishList.products.length === wishList.products.length) {
    return res.status(200).json({ msg: "Product not in wishlist" });
  }

  res.status(200).json({ msg: "Product removed from wishlist", wishList: updatedWishList });
});

