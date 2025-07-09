/*
  Warnings:

  - Added the required column `cover` to the `Stream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail` to the `Stream` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "StreamType" ADD VALUE 'Youtube_Music';

-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "cover" TEXT NOT NULL,
ADD COLUMN     "thumbnail" TEXT NOT NULL;
