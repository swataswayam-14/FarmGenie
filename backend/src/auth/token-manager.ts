import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { cookieName } from "../utils/cookieName";

export const createToken = (id:string, email:string, expiresIn:string) => {
    const payload = {id, email};
    const token = jwt.sign(payload, process.env.JWT_SECRET || "secret", {
        expiresIn,
    });
    return token;
}

export const verifyToken = async(req:Request, res:Response, next:NextFunction) => {
    const token = req.signedCookies[`${cookieName}`];
    if(!token || token.trim() === "") {
        return res.status(401).json({
            message:"Token not recieved"
        });
    }

    return new Promise<void>((resolve, reject) => {
        return jwt.verify(token, process.env.JWT_SECRET || "secret", (err:any, success:any) => {
            if(err) {
                reject(err.message);
                return res.status(401).json({
                    message:"token expired"
                })
            }else {
                resolve();
                res.locals.jwtData = success;
                return next();
            }
        })
    })
}