import mongoose from "mongoose";

const { Schema, ObjectId } = mongoose;

const Auth = new Schema({
    id: { type: ObjectId},
    user: {type: String, required: true},
    password: {type: String, required: true},
    address: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    role: {type: String},
});


export default mongoose.model('Auth', Auth)