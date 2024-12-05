import { v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

// Cloudinary Configuration
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRETE
    })

const uploadFileOnCloudinary = async (localFilePath) => {
    try {
        if(!localPath) return null

        const response = cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })

        console.log('File successfully upload on cloudinary')
        fs.unlinkSync(localFilePath)
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null
    }
}

export { uploadFileOnCloudinary }