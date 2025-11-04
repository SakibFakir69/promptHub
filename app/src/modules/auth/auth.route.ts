import { Request, Response, Router } from "express";
import { authController } from "./auth.controller";
import { verifyToken } from "../../middleware/verifyToken";
import passport from "passport";
import { User } from "../users/user.model";





const router = Router();


router.get('/me', verifyToken,authController.getMe);




router.post('/login-user',authController.loginUser);
router.post('/reset-password',verifyToken, authController.ResetPassword);
router.post('/change-password', verifyToken, authController.changePassword);
router.post('/refresh',authController.refreshToken);

router.post('/logout',authController.loginUser )
// google
router.get('/google', passport.authenticate('google',{scope:['profile','email']}));

router.get('/google/callback', passport.authenticate("google",{
    failureRedirect:"/"
    // if failed to login gave route to redriect
}), (req:Request,res:Response)=>{
     res.redirect('/dashboard');

})

router.get('/dashboard', async (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
  const user = await User.findById(req.user);
  res.render('dashboard', { user });
});



export const AuthRouter = router;