import jwt from 'jsonwebtoken'
import AuthSchema from '../models/authModel.js';
export default async function checkLogin(req, res, next) {
    if(req.path === '/api/user/login' 
    || req.path === '/api/user/register' 
    || req.path === '/api/user/sendOtpEmail' 
    || req.path === '/api/user/verifyEmail'
    || req.path === '/api/user/refreshToken'
    || req.path === '/api/user/sendOtpEmailForgetPw'
    || req.path === '/api/user/verifyEmailForgetPw'
    || req.path === '/api/user/forgetPw') {
         next();
         return 
    }
    const token = req?.headers?.authorization?.split(' ')[1];
    try {
        if(token) {
            const {user} = jwt.verify(token, process.env.PRIVATE_KEY);
            const dataUserCheck = await AuthSchema.findOne({ user });
            if(req.path === '/api' && dataUserCheck) {
                req.data = dataUserCheck;
                next()

            }
            else if(dataUserCheck) {
                req.data = dataUserCheck;
                next();
            }
            else {
                res.status(404).json({ error:"Token khong hop le! "})
            }
        }
        else if(!token && req.path === '/api') {
            next();
        }
        else {
            res.status(404).json({ error:"Token khong hop le! "})
        }
    } catch (error) {
        if(error.message === "jwt expired") {
            return res.status(404).json({ error:"jwt expired"})
        }
        res.status(404).json({ error:"Token khong hop le! "})
    }
}