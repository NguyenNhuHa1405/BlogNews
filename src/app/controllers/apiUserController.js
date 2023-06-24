import AuthSchema from '../models/authModel.js';
import { query, validationResult } from 'express-validator';
import bcrypt from "bcrypt";
import Exception from '../../error/Exception.js';
import jwt from 'jsonwebtoken';

class apiUserController {
    async getUser(req, res, next) {
        try {
            res.json(req.params.id)
        } catch (error) {
            
        }
    } 

    async login(req, res, next) {
        try {
            const result = validationResult(req);
            if (result.isEmpty()) {
                const { user, password } = req.body
                let findUser = await AuthSchema.findOne({ user }).exec()
                const { role } = findUser
                if(!!findUser) {
                    const isMatch = await bcrypt.compare(password, findUser.password);
                    if(isMatch) {
                        const token = jwt.sign({ user }, process.env.PRIVATE_KEY , { expiresIn: "10h"});
                        return res.json({ token })
                    }else {
                        return res.status(200).json({ error: 'error' })
                    }
                }
                return res.status(200).json({ error: 'error' })
            }
            res.json({ errors: result.array() });
        } catch (error) {
            // throw new Exception(Exception.CANNOT_LOGIN_USER)
            return res.status(400).json({ error: 'error' })
        }
    }

    async register(req, res, next) {
        try {
            const { user, password, address, phoneNumber, role } = req.body
            let findUser = await AuthSchema.findOne({ user }).exec()
            if(findUser) {
                return res.json({ error: 'User already exists' })
            }
            
            await bcrypt.hash(password, parseInt(process.env.SALT_ROUND)).then( async function(hash) {
                const passwordHash = hash;
                await AuthSchema.create({
                    user,
                    password: passwordHash,
                    phoneNumber, address, role
                });
                return res.json({ success: 'register successfully'})
            });
            
        } catch (error) {
            // throw new Exception(Exception.CANNOT_REGISTER_USER)
        }
    }
}

export default new apiUserController;