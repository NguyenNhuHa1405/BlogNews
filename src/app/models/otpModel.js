import mongoose from "mongoose";

const { Schema, ObjectId } = mongoose;

const otp = new Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true},
});


export default mongoose.model('otp', otp)