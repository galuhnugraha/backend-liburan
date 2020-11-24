const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const testimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    itemId : {
        type : ObjectId,
        ref: 'Item'
    }
})

module.exports = mongoose.model('Testimonial',testimonialSchema)