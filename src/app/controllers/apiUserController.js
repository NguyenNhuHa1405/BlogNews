import AuthSchema from '../models/authModel.js';
import { query, validationResult } from 'express-validator';
import bcrypt from "bcrypt";
import Exception from '../../error/Exception.js';
import jwt from 'jsonwebtoken';
import otpSchema from '../models/otpModel.js'
import authVerified from '../models/authVerified.js'
import otpGenerator from 'otp-generator';

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
            const { user, password, address, phoneNumber, email } = req.body
            const role = 'user';
            let findUser = await AuthSchema.findOne({ user }).exec()
            const emailVerified = await authVerified.findOne({ email }).exec()
            if(findUser) {
                return res.json({ error: 'User already exists' })
            }
            else if(!emailVerified?.verified) {
                return res.json({ error: 'email not verify'})
            }
            
            await bcrypt.hash(password, parseInt(process.env.SALT_ROUND)).then( async function(hash) {
                const passwordHash = hash;
                await AuthSchema.create({
                    user,
                    password: passwordHash,
                    phoneNumber, address, role, email
                });
                return res.json({ success: 'register successfully'})
            });
            
        } catch (error) {
            // throw new Exception(Exception.CANNOT_REGISTER_USER)
        }
    }


    async sendOtpEmail(req, res){
        try {
            const {email} = req.body;
            const user = await AuthSchema.findOne({ user: email });
            if(user) {
                return res.json({ error: 'User already exists' })
            }
            const emailOtp = await otpSchema.find({email});
            if(emailOtp.length >= 5) {
                return res.json({ error: 'too many send otp'})
            }
            else {
                const OTP = otpGenerator.generate(6, {
                    digits: true,
                    lowerCaseAlphabets: false,
                    upperCaseAlphabets: false,
                    specialChars: false,
                })
                const OTPhash = await bcrypt.hash(OTP, parseInt(process.env.SALT_ROUND))
                await otpSchema.create({ email, otp: OTPhash });
                return res.json({ OTP: OTP})
            }
            
        } catch (error) {
            return res.json({ error: error})
        }
        
    }

    async verifyEmail(req, res, next) {
        try {
            const { email, otp } = req.body;
            const emailOtp =  await otpSchema.find({ email});
            if(!emailOtp) {
                return res.json({ error:'email not found'});
            }
            const otpHash = emailOtp[emailOtp.length - 1].otp;
            const result = await bcrypt.compare(otp, otpHash);
            if(result) {
                let emailVerified = await authVerified.findOne({ email: email})
                if(emailVerified?.verified) {
                    return res.json({ result: 'email verified' });
                }
                
                    const emailVerify = await authVerified.create({ email, verified: true})
                    return res.json({ emailVerify })
                
            }else {
                return res.json({ error:'Invalid otp' });
            }
        } catch (error) {
            return res.json({ error: error});
        }
    }
}

export default new apiUserController;