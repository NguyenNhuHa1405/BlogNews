import mongoose from "mongoose";

const { Schema, ObjectId } = mongoose;

const otp = new Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true},
    // time: {type: Date, default: Date.now(), index: {expires: "5m"} }
});


export default mongoose.model('otp', otp)