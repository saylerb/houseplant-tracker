const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const PLAINTEXT_PASSWORD = process.env.PLAINTEXT_PASSWORD;
const SALT_ROUNDS = 12;

async function createPassword() {
  const hashed = await bcrypt.hash(PLAINTEXT_PASSWORD, SALT_ROUNDS);

  return hashed;
}

async function getAllPlants() {
  const allPlants = await prisma.plant.findMany();

  return allPlants;
}

async function getAllPlantsWithOutOwner() {
  const allPlantsWithoutOwner = await prisma.plant.findMany({
    where: {
      personId: null,
    },
  });

  console.log("All plants without an owner: ", allPlantsWithoutOwner);

  return allPlantsWithoutOwner;
}

async function createUser() {
  const admin = await prisma.person.create({
    data: {
      name: "admin",
      email: "sayler.b@gmail.com",
      password: await createPassword(),
    },
  });

  console.log("created admin user ", admin);

  return admin;
}

async function addPlantsToAdmin(person) {
  const allPlants = await getAllPlantsWithOutOwner();

  const allPlantsIds = allPlants.map((plant) => ({ id: plant.id }));

  const admin = await prisma.person.update({
    where: {
      id: person.id,
    },
    data: { plants: { connect: allPlantsIds } },
  });

  console.log("Updated admin user with plants: ", admin);
}

createUser()
  .then((person) => addPlantsToAdmin(person))
  .then(getAllPlants)
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
