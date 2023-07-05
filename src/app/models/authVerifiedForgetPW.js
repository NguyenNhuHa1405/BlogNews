import mongoose from "mongoose";

const { Schema, ObjectId } = mongoose;

const authVerifiedForgetPW = new Schema({
    verified: {type: Boolean},
    email: {type: String},
    // time: {type: Date, default: Date.now(), index: {expires: '5m'}},
});


export default mongoose.model('authVerifiedForgetPW', authVerifiedForgetPW)