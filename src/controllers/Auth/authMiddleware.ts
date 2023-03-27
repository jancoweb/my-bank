import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number,
        email: string,
        phone: string,
        address: string
      }
    }
  }
}

export class Auth {
  async validate(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ error: "Auth inválida" })
    const token = authorization.split(" ")[1];

    try {
      const jwtsecret = process.env.JWT_SECRET ?? '';
      const data = jwt.verify(token, jwtsecret);
      if (typeof (data) !== 'object') return res.status(500)

      const findUser = await prisma.user.findFirst({
        where: {
          id: data.id
        }
      })
      if (!findUser) return res.status(404).json({ error: "Usuário não encontrado" });

      const { password, ...user } = findUser;
      req.user = user
      next();
    } catch (e: any) {
      return res.status(401).json({ error: e.message })
    }
  }
}