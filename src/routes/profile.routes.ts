import { isUserLoggedIn } from "@/middlewares/auth.middleware";
import { Router } from "express";


const profileRouter = Router();

profileRouter.post('/', isUserLoggedIn, createProfile);
profileRouter.get('/', isUserLoggedIn, getProfile);
profileRouter.put('/', isUserLoggedIn, updateProfile);
profileRouter.delete('/', isUserLoggedIn, deleteProfile);


export default profileRouter;
