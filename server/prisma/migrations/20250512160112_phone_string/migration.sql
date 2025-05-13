-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "level" TEXT NOT NULL,
    "surname" TEXT,
    "name" TEXT,
    "patronymic" TEXT,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "access" BOOLEAN NOT NULL DEFAULT false,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "email" TEXT,
    "phone" TEXT,
    "comment" TEXT,
    "agreement" BOOLEAN DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "modelsMetadata" JSONB
);
INSERT INTO "new_users" ("access", "agreement", "comment", "createdAt", "email", "endDate", "id", "level", "login", "modelsMetadata", "name", "password", "patronymic", "phone", "startDate", "surname", "updatedAt") SELECT "access", "agreement", "comment", "createdAt", "email", "endDate", "id", "level", "login", "modelsMetadata", "name", "password", "patronymic", "phone", "startDate", "surname", "updatedAt" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
