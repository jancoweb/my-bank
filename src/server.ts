import express from 'express';
import cors from 'cors';
import { userRoutes } from './routes';

const app = express();

app.use(cors())
app.use(express.json())
app.use(userRoutes)

app.listen(3000)
