import { Router } from 'express';

import SigninController from '../controllers/Signin';
import SignupContoller from '../controllers/Signup';
import AuthUtilController from '../controllers/AuthUtil';

const router = Router();

router.post('/auth/signin',SigninController.perform)

router.post('/auth/signup',SignupContoller.perform)

router.post('/auth/forgotPassword',AuthUtilController.forgetPassword)
router.post('/auth/resetPassword/:token',AuthUtilController.resetPassword)
router.post('/auth/updatePassword',AuthUtilController.updatePassword)


export default router;
