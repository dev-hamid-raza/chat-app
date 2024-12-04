import { Router } from 'express'
import { loginUser, registerUser } from '../controllers/user.controller.js'

const router = Router()


// user registration routes
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)

export default router