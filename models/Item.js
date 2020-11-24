const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    country: {
        type: String,
        default: 'Indonesia'
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    categoryId: {
        type: ObjectId,
        ref: 'Category'
    },
    imageId: [
        {
            type: ObjectId,
            ref: 'Image'
        }
    ],
    activityId: [
        {
            type: ObjectId,
            ref: 'Activity'
        }
    ],
    testimonialId: [
        {
            type: ObjectId,
            ref: 'Testimonial'
        }
    ],

    isPopular: {
        type: Boolean,
        default: false
    },

    city: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Item', itemSchema)
