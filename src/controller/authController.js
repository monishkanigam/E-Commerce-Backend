import { ZodError } from "zod";
import {UserLoginValidation, UserRegisterValidation} from '../validation/zodValidation.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { pool } from '../config/db.js'

// register api
export const register=async(req,res)=>{
    try {
        const {firstName,lastName,email,password}=req.body;

        // validation using zod
        const parseValue=UserRegisterValidation.parse({
            firstName,
            lastName,
            email,
            password,
        });
        console.log("body parse value:",parseValue);

        // create user store detail in db
        const client=await pool.connect();

        try {
            const result=await client.query("select * from users where email=$1",[parseValue.email]);
            if(result.rows.length!=0){
                res.status(400).json({
                    success:false,
                    message:"user already exists! plz login"
            });
            }
            // hash password
            const saltRounds=10;
            const hashedPassword=await bcrypt.hash(parseValue.password,saltRounds);
            console.log("hashed password hai:",hashedPassword);


            // insert user details in db
            const storeUserDetails=await client.query("insert into users(first_name,last_name,email,password)values($1,$2,$3,$4) returning *",[firstName,lastName,email,hashedPassword]);

            console.log("stored db user details is:",storeUserDetails);

            // getting created user id
            const createdUserId=storeUserDetails.rows[0];

            res.status(201).json({
                success:true,
                message:"user registered successfully!",
                user:{
                    id:createdUserId.id,
                    firstName:firstName,
                    lastName:lastName,
                    email:email,
                },
            });
         } //catch (error) {
        //     console.log("error while register user:",error);
        //     res.status(500).json({
        //         success:false,
        //         message:"internal server error",
        //     });
        // }
        finally{
            client.release();
        }
    } catch (error) {
        console.log("error while creating user:",error);
        if(error instanceof ZodError){
           res.status(400).json({
             success:false,
            message:"validation failed"
           })
        }
        res.status(500).json({
            success:false,
            message:"internal server error",
        });
    };
};


// login api
export const login=async(req,res)=>{
    const {email,password}=req.body;
    console.log("req.body is:",req.body);
    
    try {
        // validation from zod
        const parseValue=UserLoginValidation.parse({email,password});

        console.log("parseValue ki value hai:",parseValue);
         
        // db connect to create user
        const client=await pool.connect();
     
        try {
            // check if user exists or not 
            const result=await client.query("select * from users where email=$1",[parseValue.email]);
            if(result.rows.length!==1){
               return res.status(400).json({
                    success:false,
                    message:"user not found ! register first"
                })
            }
            const user=result.rows[0];
            const hashedPassword=user.password;

            //compare password
            const isPassworMtched=await bcrypt.compare(parseValue.password,hashedPassword);
            if(!isPassworMtched){
            return res.status(403).json({
                    success:false,
                    message:"invalid credentials"
                })
            }
          // generate token
          const token=jwt.sign({
            id:user.id,
            email:user.email,
          },process.env.JWT_SECRET,{expiresIn:'1h'});

          // return response
         return res.status(200).json({
            success:true,
            message:"user login successfully!",
            token,
          });
        } finally{
            client.release();
        } 

    } catch (error) {
        console.log("error while login user:",error);
        if(error instanceof ZodError){
          return  res.status(400).json({
                success:false,
                message:"validatin failed"
            })
        }
       return res.status(500).json({
            success:false,
            message:"internal server error",
        })
    }
}