-- CreateEnum
CREATE TYPE "AssessmentStatus" AS ENUM ('DRAFT', 'COMPLETED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "consented_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessments" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "AssessmentStatus" NOT NULL DEFAULT 'DRAFT',
    "answers" JSONB NOT NULL,
    "current_screen_id" TEXT,
    "questionnaire" JSONB,
    "question_set_version" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blueprints" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "assessment_id" TEXT NOT NULL,
    "content_version" INTEGER NOT NULL DEFAULT 1,
    "profile_summary" JSONB NOT NULL,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blueprints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_matches" (
    "id" TEXT NOT NULL,
    "blueprint_id" TEXT NOT NULL,
    "career_id" TEXT NOT NULL,
    "match_percent" INTEGER NOT NULL,
    "is_recommended" BOOLEAN NOT NULL DEFAULT false,
    "content" JSONB NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "career_matches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "assessments_user_id_status_idx" ON "assessments"("user_id", "status");

-- CreateIndex
CREATE INDEX "blueprints_user_id_idx" ON "blueprints"("user_id");

-- CreateIndex
CREATE INDEX "career_matches_career_id_idx" ON "career_matches"("career_id");

-- CreateIndex
CREATE UNIQUE INDEX "career_matches_blueprint_id_career_id_key" ON "career_matches"("blueprint_id", "career_id");

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprints" ADD CONSTRAINT "blueprints_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprints" ADD CONSTRAINT "blueprints_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_matches" ADD CONSTRAINT "career_matches_blueprint_id_fkey" FOREIGN KEY ("blueprint_id") REFERENCES "blueprints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Constraints Prisma can't express — see reference/DATABASE_DECISIONS.md
--
-- These are hand-written and will NOT be reproduced if this migration is ever
-- regenerated or squashed from the schema — Prisma can't express any of them.
-- Carry all three across by hand and verify against pg_indexes and
-- pg_constraint; nothing fails loudly when they go missing.

-- At most one active draft per user. createDraft() also clears the previous
-- draft inside the same transaction that inserts the new one; this index is
-- the guarantee that survives two concurrent calls, that transaction is the
-- behaviour.
CREATE UNIQUE INDEX "assessments_one_active_draft"
  ON "assessments" ("user_id") WHERE "status" = 'DRAFT';

-- PRODUCT.md promises exactly one recommended career per blueprint.
CREATE UNIQUE INDEX "career_matches_one_recommended"
  ON "career_matches" ("blueprint_id") WHERE "is_recommended";

-- match_percent otherwise has no domain constraint.
ALTER TABLE "career_matches"
  ADD CONSTRAINT "match_percent_range" CHECK ("match_percent" BETWEEN 0 AND 100);
