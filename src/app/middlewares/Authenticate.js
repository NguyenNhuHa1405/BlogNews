import jwt, { decode } from 'jsonwebtoken'
import AuthSchema from '../models/authModel.js';
export default function Authentication(req, res, next) {
    var token = req?.headers?.authorization?.split(' ')[1];
    var {exp, user} = jwt.verify(token, process.env.PRIVATE_KEY);
    req.User = user;
    return next();
}