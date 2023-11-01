const mongoose=require('mongoose');

//order model
const orderSchema= new mongoose.Schema(

    {
        userId:{
            type: String,
            required:true
        },
        products: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref:'PRODUCT',
                required: true
                
            },
            quantity: {
                type: Number,
                required: true
            }
        }],
        amount:{
            type:Number,
            required:true
        },
        address:{
             type: String,
             required: true
        },
        paid:{
            type: Boolean,
            default:false
        }
    },{timestamps:true}

)

module.exports=mongoose.model("ORDER", orderSchema);