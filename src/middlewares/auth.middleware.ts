import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma =  new PrismaClient();

const jwtSecret = process.env.JWT_SECRET as string;
if (!jwtSecret) {
  console.log("JWT secret is not found");
}

export const isUserLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication token not found" });
    }

    const tokenParts = token.split(" ");
    if (tokenParts.length != 2 || tokenParts[0] !== "Bearer") {
      return res.status(401).json({ message: "Invalid token format" });
    }
    const actualToken = tokenParts[1];
    const decoded = jwt.verify(actualToken, jwtSecret) as JwtPayload;

    if (!decoded) {
      return res.status(400).json({
        success: true,
        message: "Invalid token, please login again"
      })
    }

    const userId = decoded.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    req.user = user;

    next();
  } catch (err) {
    return res.status(500).json({
        success: true,
        message: "Error in user login"
      })
  }
};

export const getJWT = async (userId: string, userRole: string) => {
  try {
    const token = jwt.sign({ userId, userRole }, jwtSecret);
    return token;
  } catch (err) {
    console.log("Error in jwt generation.");
  }
};

export const checkValidUserByPassword = async (password: string, hashedPassword: string) => {
  const isValidPassword = await bcrypt.compare(password, hashedPassword);

  return isValidPassword;
};
