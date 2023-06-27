import jwt from 'jsonwebtoken'
import AuthSchema from '../models/authModel.js';
export default async function checkLogin(req, res, next) {
    if(req.path === '/api/user/login' || req.path === '/api/user/register' || req.path === '/api') {
         next();
         return 
    }
    const token = req?.headers?.authorization?.split(' ')[1];
    try {
        if(token) {
            const {user} = jwt.verify(token, process.env.PRIVATE_KEY);
            const dataUserCheck = await AuthSchema.findOne({ user });
            if(dataUserCheck) {
                req.data = dataUserCheck;
                next();
            }
            else {
                res.status(404).json({ error:"Token khong hop le! "})
            }
        }else {
            res.status(404).json({ error:"Token khong hop le! "})
        }
    } catch (error) {
        res.status(404).json({ error:"Token khong hop le! "})
    }
}