import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt, { verify } from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWt = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace('bearer', '')
        if(!token) {
            throw new ApiError(401, 'Unauthorized request')
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRETE)
        const user = await User.findById(decodedToken?._id).select('-password -refreshToken')
        if(!user) {
            throw new ApiError(401, 'Invalid access token')
        }

        req.user = user
        next()
    } catch (error) {
        
    }
})