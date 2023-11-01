//dependencies
const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv')
const cors=require('cors')
const userRoute=require('./routes/user')
const authRoute=require('./routes/auth');
const productRoute=require('./routes/products')
const orderRoute=require('./routes/orders')
const categoryRoute=require('./routes/category')

const app=express();
dotenv.config()
//connecting mongoose
mongoose.connect(process.env.DB_URI)
.then(()=>console.log("DB connected"))
.catch((err)=>console.log(err));

app.use(express.json());
app.use(cors());

//all routes
app.use('/api/auth',authRoute);
app.use('/api/user',userRoute);
app.use('/api/products',productRoute);
app.use('/api/orders',orderRoute);
app.use('/api/categories',categoryRoute);


app.listen(process.env.PORT || 8000,()=>{
    console.log("server started at port 8000")
});