/*
  Warnings:

  - A unique constraint covering the columns `[watchlistId,symbolType,symbol]` on the table `WatchlistItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WatchlistItem_watchlistId_symbolType_symbol_key" ON "WatchlistItem"("watchlistId", "symbolType", "symbol");
