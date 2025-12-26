/*
  Warnings:

  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `name` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "professionalTitle" TEXT,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "emailVerified" DROP DEFAULT,
DROP COLUMN "role",
ADD COLUMN     "role" TEXT DEFAULT 'USER',
ALTER COLUMN "createdAt" DROP DEFAULT;
