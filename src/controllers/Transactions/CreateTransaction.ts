import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class CreateTransaction {
  async send(req: Request, res: Response) {
    // value in cents
    const { value, credAcNumber } = req.body;
    const debAcId = req.user?.id;

    try {
      const validateCredAc = await prisma.account.findFirst({ where: { number: credAcNumber } })
      if (!validateCredAc) return res.status(404).json({ error: "Insira um número de conta válido" })

      const findDebAc = await prisma.account.findFirst({ where: { id: debAcId } })
      if (!findDebAc) return res.status(500).json({ error: "Alguma coisa deu errado" })
      if (credAcNumber === findDebAc.number) return res.status(400).json({ error: "Não é possível realizar esta transação" })

      if (findDebAc.balance < value) return res.status(400).json({ error: "Saldo insuficiente" })

      await prisma.transaction.create({
        data: {
          value,
          deb_ac: findDebAc.id,
          cred_ac: validateCredAc.id
        }
      })

      const updateDebAc = await prisma.account.update({
        where: { id: debAcId },
        data: { balance: (findDebAc.balance - (value)) }
      })
      const updateCredAc = await prisma.account.update({
        where: { id: validateCredAc.id },
        data: { balance: (validateCredAc.balance + (value)) }
      })

      const TrSummary: {} = {
        updateDebAc,
        updateCredAc
      }

      return res.status(200).json(TrSummary)
    } catch (e: any) {
      return res.status(500).json({ error: e.message })
    }
  }

  async deposit(req: Request, res: Response) {
    const { value } = req.body;
    const userId = req.user?.id;

    try {
      const findAc = await prisma.account.findFirst({ where: { userId: userId } })
      if (!findAc) return res.status(500).json({ error: "Algo deu errado" })

      const tryToDeposit = await prisma.transaction.create({
        data: {
          value,
          cred_ac: findAc?.id
        }
      })

      if (!tryToDeposit) return res.status(500).json({ erro: "Não foi possível realizar deposito" })

      const newBalance = await prisma.account.update({
        where: { id: userId },
        data: { balance: (findAc.balance + value) }
      })

      return res.status(200).json(newBalance)

    } catch (e: any) {
      return res.status(500).json({ error: e.message })
    }
  }

  async withdraw(req: Request, res: Response) {
    const { value } = req.body;
    const userId = req.user?.id;

    try {
      const findAc = await prisma.account.findFirst({ where: { userId: userId } });
      if (!findAc) return res.status(500).json({ error: "Algo deu errado" })
      if (findAc?.balance < value) return

      const tryToDeposit = await prisma.transaction.create({
        data: {
          value,
          deb_ac: findAc?.id
        }
      })

      if (!tryToDeposit) return res.status(500).json({ erro: "Não foi possível realizar deposito" })

      const newBalance = await prisma.account.update({
        where: { id: userId },
        data: { balance: (findAc.balance - value) }
      })

      return res.status(200).json(newBalance)

    } catch (e: any) {
      return res.status(500).json({ error: e.message })
    }
  }
}