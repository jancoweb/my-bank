import { Router } from 'express'
import { GetAcData } from './controllers/Account/getAccountData';
import { Auth } from './controllers/Auth/authMiddleware';
import { CreateUserController } from './controllers/User/CreateUserController'
import { UserLogin } from './controllers/User/Login';

const createUserController = new CreateUserController();
const signin = new UserLogin();
const auth = new Auth();
const getAcData = new GetAcData();

const userRoutes = Router();

userRoutes.post('/signup', createUserController.handle)
userRoutes.post('/signin', signin.Login)

userRoutes.use(auth.validate)
userRoutes.get('/account', getAcData.getData)

export { userRoutes }
