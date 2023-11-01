const mongoose=require('mongoose');
// category data model
const categorySchema= new mongoose.Schema(

    {
        name:{
            type: String,
            required:true,
            unique: true
        }

    },{timestamps:true}

)

module.exports=mongoose.model("CATEGORY", categorySchema);