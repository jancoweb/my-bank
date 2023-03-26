import { CreateUserCase } from "./CreateUserCase";
import { Request, Response } from "express";
import bcrypt from 'bcrypt';

export class CreateUserController {
  async handle(req: Request, res: Response) {
    const { firstName, email, password, phone, address } = req.body;

    const hashPw = await bcrypt.hash(password, 10);

    const createUserCase = new CreateUserCase();
    const result = await createUserCase.execute({ firstName, email, password: hashPw, phone, address });

    if (result === false) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    return res.status(201).json(result);
  }
}
