import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { IAccount } from "./interface/AccountInterface";

const prisma = new PrismaClient();

export class GetAcData {
  async getData(req: Request, res: Response) {
    const id = req.user?.id;
    try {
      const findAc = await prisma.account.findFirst({ where: { userId: id } });
      const findUser = await prisma.user.findFirst({ where: { id } });
      if (!findAc || !findUser) return res.status(404).json({ error: "Conta não encontrada" });

      const account: IAccount = {
        acNumber: findAc.number,
        balance: findAc.balance,
        firstName: findUser.firstName,
        lastName: findUser.lastName,
        email: findUser.email
      }

      return res.status(200).json(account)
    } catch (e: any) {
      return res.status(500).json({ error: e.message })
    }
  }
}
