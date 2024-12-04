import { Router } from 'express'
import { loginUser, logOutUser, registerUser } from '../controllers/user.controller.js'
import { verifyJWt } from '../middlewares/auth.middleware.js'

const router = Router()


// user registration routes
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)

// ! secure routes
router.route('/logout').get(verifyJWt,logOutUser)

export default router