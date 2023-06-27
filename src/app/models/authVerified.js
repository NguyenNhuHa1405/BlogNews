import mongoose from "mongoose";

const { Schema, ObjectId } = mongoose;

const authVerified = new Schema({
    verified: {type: Boolean},
    email: {type: String}
});


export default mongoose.model('authVerified', authVerified)