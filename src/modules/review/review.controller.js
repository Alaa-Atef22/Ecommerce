import reviewModel from "../../../db/models/review.model.js";
import productModel from "../../../db/models/product.model.js";
import orderModel from "../../../db/models/order.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";

//createReview
export const createReview = asyncHandler(async (req, res, next) => {
  const { comment, rate } = req.body
  const { productId} = req.params

  const product = await productModel.findById(productId)
  if (!product) {
    return next(new AppError("product not found", 409));
  }

  const reviewExist   = await reviewModel.findOne({ createdBy: req.user._id ,productId })
  if (reviewExist) {
    return next(new AppError("your are already reviewed", 409));
  }

const order = await orderModel.findOne({ 
user: req.user._id,
"products.productId": productId,
status:"delivered"
})
  if (!order) {
    return next(new AppError("order not found", 400))
  }

  const review = await reviewModel.create({
    comment,
    rate,
productId,
    createdBy: req.user._id,
  });

let sum = product.rateAvg * product.rateNum
sum = sum + rate
product.rateAvg = sum / (product.rateNum + 1)
product.rateNum += 1

await product.save() 

  res.status(200).json({ msg: "done", review });
});

//deleteReview
export const deleteReview = asyncHandler(async (req, res, next) => {
  const {id} = req.params

  const review = await reviewModel.findOneAndDelete({ _id:id,createdBy: req.user._id})
  if (!review) {
    return next(new AppError("review not found", 409));
  }

  const product = await productModel.findById(review.productId)
  if (!product) {
    return next(new AppError("product not found", 409));
  }

  let sum = product.rateAvg * product.rateNum
sum = sum - review.rate
product.rateAvg = sum / (product.rateNum - 1)
product.rateNum -= 1

await product.save() 
  res.status(200).json({ msg: "done" });
});


