-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_cred_ac_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_deb_ac_fkey";

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "deb_ac" DROP NOT NULL,
ALTER COLUMN "cred_ac" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_deb_ac_fkey" FOREIGN KEY ("deb_ac") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_cred_ac_fkey" FOREIGN KEY ("cred_ac") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
