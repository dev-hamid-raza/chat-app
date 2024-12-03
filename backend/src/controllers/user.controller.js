import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccessTokenAndRefreshToken = async(userId) => {
    const user = User.findById(userId)
    const accessToken = user.generateAccessToken
    const refreshToken = user.generateRefreshToken
    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})
    return {accessToken, refreshToken}
}

const registerUser = asyncHandler(async (req, res) => {
    const {fullName, email, password} = req.body
    if(!fullName) {
        throw new ApiError(400,'Full name is required')
    }
    if(!email) {
        throw new ApiError(400,'Email is required')
    }
    if(!password) {
        throw new ApiError(400,'Password is required')
    }
    const exitingUser = await User.findOne({email})
    if(exitingUser) {
        throw new ApiError(409, 'User already exist')
    }
    if(password.length < 8) {
        throw new ApiError(400, 'Password length must be 8 character')
    }

    // ! Creating the user
    const user = await User.create({
        fullName,
        email,
        password
    })

    const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user._id)
    const createdUser = await User.findById(user._id).select('-password -refreshToken')

    if(!createdUser) {
        throw new ApiError(500, 'Something went wrong while registering the user')
    }

    const options = {
        httpOnly: true,
        secure: true
        }
    return res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json(
                new ApiResponse(200,{user:createdUser,accessToken,refreshToken}, 'User register successfully')
            )
})

export {
    registerUser
}