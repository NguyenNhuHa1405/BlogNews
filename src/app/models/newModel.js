import mongoose from "mongoose";

const { Schema } = mongoose;

const News = new Schema({
    title: { type: String, required: true},
    description: { type: String, required: true },
    content: { type: String, required: true},
    img: { type: String, required: true },
    descimg: { type: String, required: true },
    category: { type: String, required: true},
});


export default mongoose.model('News', News)