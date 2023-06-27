import mongoose from "mongoose";

const { Schema, ObjectId } = mongoose;

const Auth = new Schema({
    user: {type: String, required: true},
    password: {type: String, required: true},
    address: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    role: {type: String, required: true},
    email: {type: String, required: true},
});


export default mongoose.model('Auth', Auth)