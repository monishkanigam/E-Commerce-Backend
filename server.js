import express from 'express';
import dotenv from 'dotenv';
import {ConnectDB} from './config/db.js'
import authRouter from './routes/authRoute.js';
import productsRoute from './routes/productRoute.js';

import cors from 'cors';

dotenv.config();
const app=express();

app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET","POST","PUT","PATCH","DELETE"],
    credentials:true,
}));


// middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const Port=process.env.PORT;
ConnectDB();
app.use('/api/auth',authRouter);
app.use("/api/product",productsRoute);

app.get("/",(req,res)=>{
    res.send("welcome homepage");
});

app.listen(Port,()=>{
    console.log(`server is running on port ${Port}`);
})
