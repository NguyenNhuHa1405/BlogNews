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

export default router
