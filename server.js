import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import cloudinary from 'cloudinary'


import productRouter from './Routes/productRouter.js'

dotenv.config()
const app=express()


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})




app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));



//routes
app.use('/api/product',productRouter)


mongoose.connect(process.env.DB,{
    useNewUrlParser:true,
    useUnifiedTopology :true
},()=>{
    console.log("DB connected");
})




app.listen(3000,()=>console.log('sever running on port 3000'))