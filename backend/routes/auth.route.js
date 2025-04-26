import express  from 'express';
import { signup,login,logout, authCheck, verifyOtp, forgetpassword, resetPassword} from '../controllers/auth.controller.js';
import {protectRoute} from '../middleware/protectRoute.js'

const router = express.Router();

router.post('/signup',signup);
router.post('/login', login); 
router.post('/forgetpassword', forgetpassword); 
router.post('/resetpassword/:token/:email', resetPassword);
router.post('/verifyOtp', verifyOtp); 
router.post('/logout', logout);
router.get('/authCheck', protectRoute, authCheck);




export default router;