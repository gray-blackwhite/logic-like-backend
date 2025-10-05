-- CreateTable
CREATE TABLE "suggestions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ips" (
    "value" TEXT NOT NULL,

    CONSTRAINT "ips_pkey" PRIMARY KEY ("value")
);

-- CreateTable
CREATE TABLE "_IPToSuggestion" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_IPToSuggestion_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_IPToSuggestion_B_index" ON "_IPToSuggestion"("B");

-- AddForeignKey
ALTER TABLE "_IPToSuggestion" ADD CONSTRAINT "_IPToSuggestion_A_fkey" FOREIGN KEY ("A") REFERENCES "ips"("value") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IPToSuggestion" ADD CONSTRAINT "_IPToSuggestion_B_fkey" FOREIGN KEY ("B") REFERENCES "suggestions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
