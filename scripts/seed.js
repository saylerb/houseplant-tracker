const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const plantNames = [
  "Bird's Nest Fern",
  "Calathea",
  "Vick's Plant",
  "Spider Plant #1",
  "Jade",
  "Small Echeveria",
  "Spidy 2",
  "Snake Plant",
  "Cryptanthus",
  "Large Echeveria",
  "Alocasia",
  "Pothos",
  "String of Pearls",
  "Spidy 3",
  "Howarthia",
  "Philodendron Moonlight",
  "Button Fern",
];

async function seed() {
  const plantPromises = plantNames.map((name) => {
    return prisma.plant.create({
      data: {
        name,
      },
    });
  });

  await Promise.all(plantPromises);

  const allPlants = await prisma.plant.findMany();

  console.log(allPlants);
}

seed()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.disconnect();
  });
