const mongoose = require('mongoose');

//product model
const productSchema = new mongoose.Schema(

    {
        title: {
            type: String,
            required: true
        },
        image: {
            type: String,
            default: ""
        },
        desc: {
            type: String,
            required: true,

        },
        price: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        rating: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'USER'
            },
            value: {
                type: Number,
                default: 0,
            }
        }],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CATEGORY',
            required: true
        }


    }, { timestamps: true }

)

module.exports = mongoose.model("PRODUCT", productSchema);