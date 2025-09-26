import { Request, Response, NextFunction } from "express";
import { checkValidUserByPassword, getJWT } from "../middlewares/auth.middleware";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response, next: NextFunction)=> {
    try{
        const { name, email, phone, password, role } = req.body;

        if(!name || !email || !password || !phone || !role){
            return res.status(400).json({
                success: true,
                message: "Enter required fields"
            })
        }

        const user = await prisma.user.findUnique({  
            where: {
                email: email
            }
          })
        if(user){
            return res.status(409).json({
                success: true,
                message: "user is already exists."
            })
        }  

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                phone,
                password: passwordHash,
                role 
            }
        })

        const token = getJWT(newUser.id, newUser.role);

        res.status(200).json({
            success: true,
            message: "user registered successfully.",
            token: token,
            data: {
                name: newUser.name,
                email: newUser.email,
                id: newUser.id
            }
        })

    }catch(err){
        return res.status(500).json({
            success: true,
            message: "Error in user login"
        })
    }
}

export const login = async (req: Request, res: Response, next: NextFunction)=> {
    try{
        const { email, password } = req.body;
        if(!password || !email){
            return res.status(400).json({
                success: true,
                message: "Enter required fields"
            });
        }

        const user = await prisma.user.findUnique({ 
            where: {
                email: email
            }
        });
        if(!user){
            return res.status(400).json({
                success: true,
                message: "User doesn't exists, please register"
            });
        }

        const isValidUser = await checkValidUserByPassword(password, user.password);

        if(!isValidUser){
            return res.status(401).json({
                success: true,
                message: "Invalid Creadentials"
            });
        }

        const token = await getJWT(user.id, user.role);

        res.status(200).json({
            success: true,
            message: "You have loggedin successfully",
            token: token,
            data: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        })

    }catch(err){
        return res.status(500).json({
            success: true,
            message: "Error in user login"
        });
    }
}
export const logout = async (req: Request, res: Response, next: NextFunction)=> {
    try{
        res.status(200).json({
            success: true,
            message: "You have loggedout successfully"
        })

    }catch(err){
        res.status(500).json({
            success: true,
            message: "Error in user logout"
        })
    }
}
