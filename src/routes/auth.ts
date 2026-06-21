import { Router } from 'express';
import { signup, login } from '../controllers/auth';
import { validateSignup, validateLogin } from '../middleware/validate';

const router = Router();

router.post('/signup', validateSignup, signup, () => {
  /* #swagger.tags = ['Authentication']
    #swagger.summary = 'Register a new gamer account'
    #swagger.requestBody = {
        required: true,
        schema: { $ref: "#/definitions/SignupInput" }
    }
  */
});

router.post('/login', validateLogin, login, () => {
  /* #swagger.tags = ['Authentication']
    #swagger.summary = 'Authenticate using Email or Username'
    #swagger.requestBody = {
        required: true,
        schema: { $ref: "#/definitions/LoginInput" }
    }
  */
});

export default router;