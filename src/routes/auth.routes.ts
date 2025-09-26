import { login, logout, register } from "@/controllers/auth.controller";
import { Router } from "express"

const authRouter = Router();

authRouter.post('/', register);
authRouter.post('/', login);
authRouter.post('/', logout);


export default authRouter;