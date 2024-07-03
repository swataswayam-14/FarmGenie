-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Farmer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
