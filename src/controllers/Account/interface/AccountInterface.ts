import { Decimal } from "@prisma/client/runtime"

export interface IAccount {
  acNumber: string
  balance: Decimal
  firstName: string
  lastName: string
  email: string
}