import { PrismaClient, User } from '@prisma/client'
import { ICreateUser } from './interface/CreateUser';

const prisma = new PrismaClient();

export class CreateUserCase {
  async execute({ firstName, email, password, phone, address }: ICreateUser): Promise<User | boolean> {
    const verify = await prisma.user.findUnique({
      where: { email }
    });

    if (verify) {
      return false
    }

    const user = await prisma.user.create({
      data: {
        firstName,
        email,
        password,
        phone,
        address
      }
    });

    const maxNumber = Math.pow(10, 15);
    const accountNumber = Math.floor(Math.random() * maxNumber);
    await prisma.account.create({
      data: {
        number: accountNumber.toString().padStart(15, '0'),
        balance: 0,
        userId: user.id
      }
    });

    return user
  }
}
