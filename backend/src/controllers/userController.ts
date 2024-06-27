import { NextFunction, Request, Response } from "express";
import {hash, compare} from "bcrypt";
import { createToken } from "../auth/token-manager";
import { cookieName } from "../utils/cookieName";
import prisma from "../db";

export const getAllUsers = async (req:Request, res:Response, next: NextFunction) => {
    try {
        const user = await prisma.user.findMany();
        return res.status(200).json({
            message: "OK", user
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message:"ERROR",
            //@ts-ignore
            cause: error.message
        })
    }
};

export const userSignup = async(req:Request , res:Response, next: NextFunction) => {
    const {email, password, name} = req.body;
    if(!email||!password||!name) {
        return res.status(411).json({
            message: "Incorrect Inputs"
        });
    }
    try {
        const existingUser = await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(existingUser){
            return res.status(401).json({
                message:"User already exists"
            });
        }
        const hashPassword = await hash(password, 10);
        const user = await prisma.user.create({
            data:{
                name, 
                email, 
                password:hashPassword
            }
        })
        res.clearCookie(cookieName, {
            httpOnly:true,
            domain:"localhost",
            signed:true,
            path:"/",
        })

        const token = createToken(user.id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);

        res.cookie(cookieName, token, {
            path:"/",
            domain:"localhost",
            expires,
            httpOnly:true,
            signed:true
        });

        return res.status(200).json({
            message: "OK", name:user.name, email: user.email
        })
    } catch (error) {
        //@ts-ignore
        return res.status(400).json({ message: "ERROR", cause: error.message });
    }
}

export const userSignin = async(req:Request, res: Response, next: NextFunction) => {
    try {
        const {email, password} = req.body;
        if(!email||!password){
            return res.status(411).json({
                message: "Incorrect Inputs"
            })
        }
        const user = await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(!user){
            return res.status(401).json({
                message: "User not registered"
            })
        }
        const isPasswordCorrect = compare(password, user.password);

        if(!isPasswordCorrect){
            return res.status(403).json({
                message: "Incorrect inputs"
            })
        }

        res.clearCookie(cookieName, {
            httpOnly:true,
            domain:"localhost",
            signed:true,
            path:"/",
        });

        const token = createToken(user.id.toString(), user.email, "7d");

        const expires = new Date();
        expires.setDate(expires.getDate() + 7);

        res.cookie(cookieName, token, {
            path:"/",
            domain:"localhost",
            expires,
            httpOnly:true,
            signed:true
        })
        return res.status(200).json({
            message: "Ok",
            name: user.name,
            email:user.email
        })
    } catch (error) {
        return res.status(400).json({
            message:"ERROR",
            //@ts-ignore
            cause: error.message
        })
    }
}

export const verifyUser = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const user = await prisma.user.findUnique({
            where:{
                id:res.locals.jwtData.id
            }
        })
        
        if(!user){
            return res.status(401).json({
                message:"User not registered or token malfunctioned"
            });
        }
        if(user.id.toString() !== res.locals.jwtData.id) {
            return res.status(401).json({
                message:"permission denied due to mismatching"
            });
        }
        return res.status(200).json({
            message: "OK", name:user.name,email:user.email
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message:"ERROR",
            //@ts-ignore
            cause: error.message
        })
    }
}

export const userLogout = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const user = await prisma.user.findUnique({
            where:{
                id:res.locals.jwtData.id
            }
        })
        if(!user){
            return res.status(401).json({
                message:"User not registered or token malfunctioned"
            });
        }
        if(user.id.toString() !== res.locals.jwtData.id) {
            return res.status(401).json({
                message:"permission denied due to mismatching"
            });
        }
        res.clearCookie(cookieName, {
            httpOnly:true,
            domain:"localhost",
            signed:true,
            path:"/",
        });
        return res.status(200).json({
            message: "OK", name:user.name,email:user.email
        })
    } catch (error) {
        return res.status(400).json({
            message:"ERROR",
            //@ts-ignore
            cause: error.message
        })
    }
}