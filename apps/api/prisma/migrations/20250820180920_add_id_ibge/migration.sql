/*
  Warnings:

  - A unique constraint covering the columns `[ibge_uf_id]` on the table `estados` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ibge_id]` on the table `municipios` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ibge_uf_id` to the `estados` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ibge_id` to the `municipios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "estados" ADD COLUMN     "ibge_uf_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "municipios" ADD COLUMN     "ibge_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "estados_ibge_uf_id_key" ON "estados"("ibge_uf_id");

-- CreateIndex
CREATE UNIQUE INDEX "municipios_ibge_id_key" ON "municipios"("ibge_id");
