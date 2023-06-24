import mongoose from "mongoose";

const { Schema } = mongoose;

const News = new Schema({
    title: { type: String},
    description: { type: String },
    content: { type: String},
    img: { type: String },
    descimg: { type: String },
    category: { type: String},
});


export default mongoose.model('News', News)