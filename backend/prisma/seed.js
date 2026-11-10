import prisma from "../src/lib/prisma.js";

async function main() {
  const artista = await prisma.artista.upsert({
    where: { nombre: "Daft Punk" },
    update: {},
    create: { nombre: "Daft Punk", genero: "Electrónica" },
  });

  await prisma.cancion.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      titulo: "Around the World",
      duracion: 429,
      favorita: true,
      anio: 1997,
      artistaId: artista.id,
    },
  });
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
