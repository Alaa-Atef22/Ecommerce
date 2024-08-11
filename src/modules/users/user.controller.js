
import userModel from "../../../db/models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from '../../utils/classError.js'
import { sendEmail } from '../../service/sendEmail.js'
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import { nanoid ,customAlphabet } from "nanoid";

//signup
export const signUp = asyncHandler(async (req , res , next) =>{
    const {name ,email ,password,cPassword,age,phone,address} = req.body
    const userExist = await userModel.findOne({ email: email.toLowerCase() })
    userExist && next(new AppError("user already exists",409))
    const token = jwt.sign({ email }, process.env.signatureToken,{expiresIn: 60 * 2})
    const link = `${req.protocol}://${req.headers.host}/users/verifyEmail/${token}`
    const refToken = jwt.sign({ email }, process.env.signatureTokenRefresh)
    const refLink = `${req.protocol}://${req.headers.host}/users/refreshToken/${refToken}`
    await sendEmail(email,"verify your email",`<a href="${link}">Click here to confirm your email</a>
        <br>
        <a href="${refLink}">Click here to resend the link</a>`)
    const hash =bcrypt.hashSync(password , +process.env.saltRounds)
    const user = new userModel({
        name ,email ,password:hash,age,phone,address
    })
    const newUser = await user.save()
    newUser? res.status(200).json({msg:'done',user: newUser}): next(new AppError("user not created",500))
    })

 // verify Email
export const verifyEmail = asyncHandler(async (req , res , next) =>{
    const {token} =req.params
    const decoded = jwt.verify(token, process.env.signatureToken)
    if (!decoded?.email) return next(new AppError("Invalid token",400))
const user = await userModel.findOneAndUpdate({email: decoded.email, confirmed:false},{ confirmed: true })
    user? res.status(200).json({msg:'done'}): next(new AppError("user not exist or already confirmed",400))
    })

 // refreshToken
export const refreshToken = asyncHandler(async (req , res , next) =>{
    const {refToken} =req.params
    const decoded = jwt.verify(refToken, process.env.signatureTokenRefresh)
    if (!decoded?.email) return next(new AppError("Invalid token",400))
    const user = await userModel.findOne({email:decoded.email, confirmed:true})
if(user){return next(new AppError("user already confirmed",400))}
    const token = jwt.sign({ email:decoded.email }, process.env.signatureToken,{expiresIn: 60 * 2})
    const link = `${req.protocol}://${req.headers.host}/users/verifyEmail/${token}`
    await sendEmail(decoded.email,"verify your email",`<a href="${link}">Click here to confirm your email</a>`)
    res.status(200).json({msg:'done'})
    })

 // forget password
export const forgetPassword = asyncHandler(async (req , res , next) =>{
    const { email } = req.body;
    const user = await userModel.findOne({  email: email.toLowerCase()  });
    if (!user) {return next(new AppError('user not found.',404))}
    const code = customAlphabet("0123456789",5)
    const newCode = code()
    await sendEmail(email,"code for reset password",`<h1 > your code is ${newCode}</h1>`)
    await userModel.updateOne({email},{code:newCode})
    res.status(200).json({msg:'done'})
    })

// reset password
export const resetPassword = asyncHandler(async (req , res , next) =>{
    const { email ,code,password} = req.body;
    const user = await userModel.findOne({  email: email.toLowerCase()  });
    if (!user) {return next(new AppError('user not found.',404))}
    if (user.code !== code || code == "") 
        {return next(new AppError('invalid code',400))}
    const hash =bcrypt.hashSync(password , +process.env.saltRounds)
    await userModel.updateOne({email},{ password:hash, code:"",passwordChangeAt:Date.now()})
    res.status(200).json({msg:'done'})
    })

// signIn
export const signIn = asyncHandler(async (req , res , next) =>{
    const { email,password} = req.body
    const user = await userModel.findOne({ email: email.toLowerCase(),confirmed:true})
    if(!user){return next(new AppError('user not found.',404))} 
    const isMatch = bcrypt.compareSync(password,user.password)
if (!isMatch){return next(new AppError('Invalid password.',400))} 
const token =jwt.sign({email,role:user.role},process.env.signatureToken)
await userModel.updateOne({email},{ loggedIn:true})
res.status(200).json({msg:'done',token})
    })