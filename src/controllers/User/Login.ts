import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export class UserLogin {
  async Login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) return res.status(404).json({ error: "É necessário preencher todos os campos" });

    const userLogged = await prisma.user.findFirst({
      where: {
        email
      }
    });
    const hashPw = userLogged ? userLogged.password : '';

    const isMatch = await bcrypt.compare(password, hashPw);

    if (isMatch === false) return res.status(401).json({ error: "Email ou senha incorretos." });

    const jwtsecret: string = process.env.JWT_SECRET ?? '';
    const token = jwt.sign({
      id: userLogged?.id
    }, jwtsecret)
    const user = {
      firstName: userLogged?.firstName,
      email: userLogged?.email
    };

    const response = { user, token };
    return res.status(200).json(response)
  }
}