/*
  Warnings:

  - Added the required column `cookingDirections` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ingredients` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nutritions` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "cookingDirections" TEXT NOT NULL,
ADD COLUMN     "ingredients" TEXT NOT NULL,
ADD COLUMN     "nutritions" JSONB NOT NULL;
