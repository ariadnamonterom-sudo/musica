-- CreateTable
CREATE TABLE "Artista" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "genero" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Cancion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "duracion" INTEGER NOT NULL,
    "favorita" BOOLEAN NOT NULL DEFAULT false,
    "artistaId" INTEGER NOT NULL,
    CONSTRAINT "Cancion_artistaId_fkey" FOREIGN KEY ("artistaId") REFERENCES "Artista" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Artista_nombre_key" ON "Artista"("nombre");
