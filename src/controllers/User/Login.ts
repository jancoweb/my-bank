import { Request, Response } from "express";
import bcrypt from 'bcrypt';

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export class UserLogin {
  async Login(req: Request, res: Response) {
    const { email, password } = req.body;
    const getAc = await prisma.user.findFirst({
      where: {
        email
      }
    })
    const hashPw = getAc ? getAc.password : '';

    const isMatch = await bcrypt.compare(password, hashPw)

    if (isMatch === false) {
      return res.status(401).json({ error: "Email ou senha incorretos." })
    }

    // AUTH COM JWT

  }
}