import mongoose, {Schema} from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        fullName: {
        type: String,
        required: true,
        },
        password: {
        type: String,
        required: true,
        minLength: 6
        },
        profilePic: {
        type: String,
        default: ''
        },
        refreshToken:{
            type:String
        }
    }, {timestamps: true}
)

// encrypting the password
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

//  checking the password 
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password,this.password)
}

// generating the access token
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            fullName: this.fullName,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRETE,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// Generating the Refresh Token
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRETE,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE
        }
    )
}
export const User = mongoose.model('User', userSchema)