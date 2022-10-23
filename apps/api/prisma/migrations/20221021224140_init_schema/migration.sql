-- CreateEnum
CREATE TYPE "TeamColor" AS ENUM ('RED', 'BLUE');

-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('LOBBY', 'WAITING_FOR_QUESTION', 'WAITING_FOR_ANSWERS', 'FINISHED');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('PL', 'EN');

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "color" "TeamColor" NOT NULL,
    "nextAnsweringPlayerId" INTEGER,
    "gameId" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "status" "GameStatus" NOT NULL DEFAULT 'LOBBY',

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameOptions" (
    "id" TEXT NOT NULL,
    "rounds" INTEGER NOT NULL,
    "language" "Language" NOT NULL,

    CONSTRAINT "GameOptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameQuestions" (
    "id" SERIAL NOT NULL,
    "round" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "gameId" TEXT NOT NULL,

    CONSTRAINT "GameQuestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameQuestionsAnswers" (
    "id" SERIAL NOT NULL,
    "gameQuestionId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL,
    "text" TEXT,
    "answerId" INTEGER,

    CONSTRAINT "GameQuestionsAnswers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "language" "Language" NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alternative" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "answerId" INTEGER NOT NULL,

    CONSTRAINT "Alternative_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_nextAnsweringPlayerId_key" ON "Team"("nextAnsweringPlayerId");

-- CreateIndex
CREATE UNIQUE INDEX "Game_id_key" ON "Game"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GameOptions_id_key" ON "GameOptions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GameQuestions_gameId_questionId_key" ON "GameQuestions"("gameId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "GameQuestions_gameId_round_key" ON "GameQuestions"("gameId", "round");

-- CreateIndex
CREATE UNIQUE INDEX "GameQuestionsAnswers_gameQuestionId_playerId_priority_key" ON "GameQuestionsAnswers"("gameQuestionId", "playerId", "priority");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_nextAnsweringPlayerId_fkey" FOREIGN KEY ("nextAnsweringPlayerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameOptions" ADD CONSTRAINT "GameOptions_id_fkey" FOREIGN KEY ("id") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameQuestions" ADD CONSTRAINT "GameQuestions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameQuestions" ADD CONSTRAINT "GameQuestions_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameQuestionsAnswers" ADD CONSTRAINT "GameQuestionsAnswers_gameQuestionId_fkey" FOREIGN KEY ("gameQuestionId") REFERENCES "GameQuestions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameQuestionsAnswers" ADD CONSTRAINT "GameQuestionsAnswers_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameQuestionsAnswers" ADD CONSTRAINT "GameQuestionsAnswers_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alternative" ADD CONSTRAINT "Alternative_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
