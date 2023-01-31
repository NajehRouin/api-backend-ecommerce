require('dotenv').config()
const express=require('express')
const mongoose=require('mongoose')
const cors =require('cors')
const fileUpload =require('express-fileupload')
const cookieParser=require('cookie-parser')


const user=require('./routes/userRouter')
const category=require('./routes/categoryRouter')
const upload=require('./routes/upload')
const product=require('./routes/productRouter')



const app=express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
    useTempFiles:true
}))

//Routes

app.use('/user',user) 
app.use('/api',category)
app.use('/api',upload)
app.use('/api',product)

//connect to mongodb
const URI=process.env.MONGODB_URL
mongoose.connect(URI,{
  
    useNewUrlParser:true,
    useUniFiedTopology:true

},err=>{
    if(err) throw err;
    console.log('Connect to Mongo DB ')
})



app.get('/',(req,res)=>{
    res.json({msg:'Welcom to my app'})
})

const PORT =process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log('Server is running on Port ',PORT)
})

