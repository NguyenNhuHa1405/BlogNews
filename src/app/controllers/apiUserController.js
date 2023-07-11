import AuthSchema from '../models/authModel.js';
import { query, validationResult } from 'express-validator';
import bcrypt from "bcrypt";
import Exception from '../../error/Exception.js';
import jwt from 'jsonwebtoken';
import otpSchema from '../models/otpModel.js'
import authVerified from '../models/authVerified.js'
import otpGenerator from 'otp-generator';
import client from '../../config/redis/connectRedis.js'
import authVerifiedForgetPW from '../models/authVerifiedForgetPW.js'


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
                        const token = jwt.sign({ user }, process.env.PRIVATE_KEY , { expiresIn: "20s"});
                        const refreshToken = jwt.sign({ user }, process.env.PRIVATE_KEY, {  expiresIn: "1y" });
                        await client.set(user, refreshToken, 'Ex', 365 * 24 * 60 * 60);
                        return res.json({ token, refreshToken })
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
            let findUser = await AuthSchema.findOne({ user }).exec()
            const emailVerified = await authVerified.findOne({ email }).exec()
            emailVerified = emailVerified[emailVerified.length - 1];
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
                    phoneNumber, address, email
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
            const user = await AuthSchema.findOne({ email });
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
            if(!emailOtp.toString()) {
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

    async refreshToken(req, res, next) {
        try {
            let { refreshToken } = req.body;
            const { user } = jwt.verify(refreshToken, process.env.PRIVATE_KEY);
            const rfToken = await client.get(user);
            if(!refreshToken){
                return res.json({error: "RefreshToken khong hop le!"})
            }
            else if(rfToken === refreshToken) {
                const token = jwt.sign({ user }, process.env.PRIVATE_KEY, {expiresIn: '20s'});
                refreshToken = jwt.sign({ user }, process.env.PRIVATE_KEY, {expiresIn: '1y'});
                await client.set(user, refreshToken, "Ex", 365 * 24 * 60 * 60)
                return res.json({ token, refreshToken})
            }
            else {
                return res.json({error: "RefreshToken khong hop le!"})
            }
            
        } catch (error) {
            return res.json({ error: "RefreshToken khong hop le!" });
        }
    }

    async sendOtpEmailForgetPw(req, res) {
        try {
            const {email} = req.body;
            const user = await AuthSchema.findOne({ email });
            if(!user) {
                return res.json({ error: 'email not exists' })
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

    async verifyEmailForgetPw(req, res) {
        try {
            const { email, otp } = req.body;
            const emailOtp =  await otpSchema.find({ email });
            console.log(emailOtp)
            if(!emailOtp.toString()) {
                return res.json({ error:'email not found'});
            }
            const otpHash = emailOtp[emailOtp.length - 1].otp;
            const result = await bcrypt.compare(otp, otpHash);
            if(result) {
                let emailVerified = await authVerifiedForgetPW.findOne({ email: email})

                if(emailVerified?.verified) {
                    return res.json({ result: 'email verified' });
                }
                
                    const emailVerify = await authVerifiedForgetPW.create({ email, verified: true})
                    return res.json({ emailVerify })
                
            }else {
                return res.json({ error:'Invalid otp' });
            }
        } catch (error) {
            return res.json({ error: error});
        }
    }

    async forgetPw(req, res) {
        try {
            const { email, password, authpassword } = req.body;
            if(! (password === authpassword)) {
                return res.josn({ error:" password does not match"})
            }
            const userFind = await AuthSchema.findOne({ email }).exec() 
            const userVerifiedFind = await authVerifiedForgetPW.findOne({ email });
            if(!userFind) {
                res.json({ error: "User not exists"})
            }
            if(!userVerifiedFind) {
                return res.json( { error: 'Unable to restore'});
            }
            const verified = userVerifiedFind?.verified;
            console.log(verified)
            if(!verified) {
                res.json({ error: 'unverified email' }) 
            }
            await bcrypt.hash(password, parseInt(process.env.SALT_ROUND)).then( async function(hash) {
                const passwordHash = hash;
                console.log(passwordHash)
                await AuthSchema.updateOne({
                    email
                }, {
                    password: passwordHash,
                });
                await authVerifiedForgetPW.updateOne( {email}, {
                    verified: false,
                })
                return res.json({ success: 'password reset successful'})
            });
        } catch (error) {
            return res.json({ error: "Unable to restore" });
        }

    }
}

export default new apiUserController;