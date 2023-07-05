import express from 'express';
const router = express.Router();
import apiUserController from '../app/controllers/apiUserController.js';
import { body, validationResult } from 'express-validator';


router.get('/:id', apiUserController.getUser)
router.post('/login',
body('user').isEmail(),
body('password').isLength({ min: 5 }),
apiUserController.login);
router.post('/register', apiUserController.register)

router.post('/sendOtpEmail', apiUserController.sendOtpEmail)
router.post('/verifyEmail', apiUserController.verifyEmail) 

router.post('/refreshToken', apiUserController.refreshToken);

router.post('/sendOtpEmailForgetPw', apiUserController.sendOtpEmailForgetPw);
router.post('/verifyEmailForgetPw', apiUserController.verifyEmailForgetPw);
router.post('/forgetPw', apiUserController.forgetPw);

export default router
