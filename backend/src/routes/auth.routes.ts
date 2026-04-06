import { Hono } from "hono";
import { 
  register, 
  verifyRegister, 
  login, 
  verifyLogin, 
  forgotPassword, 
  resetPassword 
} from "../controllers/auth.controller";

const authRouter = new Hono();

authRouter.post("/register", register);          
authRouter.post("/verify-register", verifyRegister); 

authRouter.post("/login", login);                
authRouter.post("/verify-login", verifyLogin);    

authRouter.post("/forgot-password", forgotPassword); 
authRouter.post("/reset-password", resetPassword);  

export default authRouter;