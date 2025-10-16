import {  ZodError } from "zod";
import { userLogin,userRegister } from "../validation/zodValidation.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

// register api

export const Register=async(req,res)=>{
    try {
        const {firstName,lastName,email,password}=req.body;
        console.log("req body",req.body);

        // zod ka validation
        const zodValidation=await userRegister.parse({
            firstName,
            lastName,
            email,
            password
        });
        console.log("zod validation ki value:",zodValidation);

    //    create user store deatilas in db
    const client=await pool.connect();

        try {
            // user exit or not
        const userExist=await client.query("select * from users where email=$1",[email]);
        if(userExist.rows.length!=0){
            return res.status(200).json({
                success:false,
                Message:"user already exist! plz login"
            });
        }

        // hashed password
        const saltRounds=10;
        const hashedPassword= await bcrypt.hash(zodValidation.password,saltRounds);
        console.log("hashedPassword is:",hashedPassword);


        // inser user details in db
        const userDetails=await client.query("insert into users (firstname,lastname,email,password)values($1,$2,$3,$4) returning *",[zodValidation.firstName,zodValidation.lastName,zodValidation.email,hashedPassword]);
        console .log("user details store in db:",userDetails);


        // user id
        const userId=userDetails.rows[0];
        res.status(201).json({
            success:true,
            Message:"user register successfully!",
            users:{
                id:userId.id,
                firstName:firstName,
                lastName:lastName,
                email:email
            },
        });
        } finally {
            client.release();
        }
    } catch (error) {
        console.log("error while creating user:",error);
        if(error instanceof ZodError){
          return res.status(400).json({
            success:false,
            Message:"validation failed",
          })
        }
        return res.status(500).json({
            success:false,
            message:"internal server error"
        });
    };
};

export const Login=async(req,res)=>{
    try {
       const {email,password}=req.body;
       console.log("req body:",req.body);
       
    //    zod validation
     const zodValidation=await userLogin.parse({
        email,password
     });
     console.log("zod validation:",zodValidation);

    //  create client store details in db
    const client=await pool.connect();
    try {
        // check krna h user exist or not
        const userExist=await client.query("select * from users where email=$1",[zodValidation.email]);
        if(userExist.rows.length!==1){
            return res.status(400).json({
                success:false,
                message:"user not found ! register first"
            });
        };
        const user=userExist.rows[0];
        console.log("user:",user);
        // password match krna
        const isPasswordMatch=await bcrypt.compare(zodValidation.password,user.password);
        if(!isPasswordMatch){
            return res.status(403).json({
                success:false,
                message:"invalid credentials"
            });
        };
        // generate token
        const token=jwt.sign({
            id:user.id,
            email:user.email
        },process.env.JWT_SECRET,{expiresIn:"1h"});
            // return response
            return res.status(200).json({
                success:true,
                alert:"login successfully!",
                token
            });
    } finally{
        client.release();
    }
    } catch (error) {
        console.log("error while login user:",error);
        if(error instanceof ZodError){
            return res.status(401).json({
                success:false,
                message:"validation failed"
            });
        };
        return res.status(500).json({
            success:false,
            message:"internal server error"
        });
    };
};