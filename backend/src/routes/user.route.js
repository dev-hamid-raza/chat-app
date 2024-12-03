import { Router } from 'express'
import { registerUser } from '../controllers/user.controller.js'

const router = Router()

const test = (req, res) => {
    res.send('Test')
}

// user registration routes
router.route('/register').post(registerUser)
router.route('/test').get(test)

export default router