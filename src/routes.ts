import { Router } from 'express'
import { CreateUserController } from './controllers/User/CreateUserController'
import { UserLogin } from './controllers/User/Login';

const createUserController = new CreateUserController();
const signin = new UserLogin();

const userRoutes = Router();

userRoutes.post('/signup', createUserController.handle)
userRoutes.post('/signin', signin.Login)

export { userRoutes }
