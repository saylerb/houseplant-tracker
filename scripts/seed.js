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
const password = process.env.PLAINTEXT_PASSWORD;

console.log({ password });

async function createOrUpdateAdminPerson() {
  const person = await prisma.person.upsert({
    where: { id: 1 },
    update: { email: "admin@houseplant.life" },
    create: {
      email: "admin@houseplant.life",
      password,
    },
  });

  return person;
}

async function seed(person) {
  const plantPromises = plantNames.map((name) => {
    return prisma.plant.create({
      data: {
        name,
        owner: {
          connect: { id: person.id },
        },
      },
    });
  });

  await Promise.all(plantPromises);

  const allPlants = await prisma.plant.findMany();

  console.log(allPlants);
}

createOrUpdateAdminPerson()
  .then((person) => seed(person))
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
