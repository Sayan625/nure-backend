const mongoose = require('mongoose');

//user model
const userSchema = new mongoose.Schema(

    {
        username: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },
        address:{
            type: String,
            required:true
        },
        isAdmin:{
            type: Boolean,
            default: false
        },
        password: {
            type: String,
            required: true
        },
        cart: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref:'PRODUCT',
                default: null
            },
            quantity: {
                type: Number,
            }
        }]

    }, { timestamps: true }

)

module.exports = mongoose.model("USER", userSchema);