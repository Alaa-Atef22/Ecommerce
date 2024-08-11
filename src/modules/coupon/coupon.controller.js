import couponModel from "../../../db/models/coupon.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";

//createCoupon
export const createCoupon = asyncHandler(async (req, res, next) => {
  const { code, amount, fromDate, toDate } = req.body;
  const couponExist = await couponModel.findOne({ code: code.toLowerCase() });
  if (couponExist) {
    return next(new AppError("coupon already exists", 409));
  }
  const coupon = await couponModel.create({
    code,
    amount,
    fromDate,
    toDate,
    createdBy: req.user._id,
  });
  res.status(200).json({ msg: "done", coupon });
});

//updateCoupon
export const updateCoupon = asyncHandler(async (req, res, next) => {
  const { code, amount, fromDate, toDate } = req.body;
  const { id } = req.params;
  const coupon = await couponModel.findOneAndUpdate(
    { _id: id, createdBy: req.user._id },
    {
      code,
      amount,
      fromDate,
      toDate,
    },
    { new: true }
  );
  if (!coupon) {
    return next(
      new AppError("coupon not exists or you dont have permission", 409)
    );
  }
  res.status(200).json({ msg: "done", coupon });
});

//deleteCoupon
export const deleteCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const coupon = await couponModel.findOneAndDelete({
    _id: id,
    createdBy: req.user._id,
  });
  if (!coupon) {
    return next(new AppError("Coupon not found", 404));
  }
  res.status(200).json({ msg: "Coupon deleted successfully" });
});

// getCouponById
export const getCouponById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const coupon = await couponModel.findOne({ _id: id });
  if (!coupon) {
    return next(new AppError("coupon not found", 404));
  }
  return res.status(200).json(coupon);
});

// getAllCoupons
export const getAllCoupons = asyncHandler(async (req, res, next) => {
  const coupons = await couponModel.find({});
  res.status(200).json({ coupons });
});
