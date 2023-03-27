import { Router } from 'express'
import { GetAcData } from './controllers/Account/getAccountData';
import { Auth } from './controllers/Auth/authMiddleware';
import { CreateTransaction } from './controllers/Transactions/CreateTransaction';
import { CreateUserController } from './controllers/User/CreateUserController'
import { UserLogin } from './controllers/User/Login';

const createUserController = new CreateUserController();
const signin = new UserLogin();
const auth = new Auth();
const getAcData = new GetAcData();
const createTransaction = new CreateTransaction();

const userRoutes = Router();

userRoutes.post('/signup', createUserController.handle)
userRoutes.post('/signin', signin.Login)

userRoutes.use(auth.validate)
userRoutes.get('/account', getAcData.getData)
userRoutes.post('/transaction/send', createTransaction.send)
userRoutes.post('/transaction/deposit', createTransaction.deposit)
userRoutes.post('/transaction/withdraw', createTransaction.withdraw)

export { userRoutes }
