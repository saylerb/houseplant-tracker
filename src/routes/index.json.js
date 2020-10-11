const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

export async function get(req, res) {
  const allPlants = await prisma.plant.findMany();
  return res.json(allPlants);
}

export async function put(req, res) {
  const updated = await prisma.plant.update({
    where: {},
    data: {}
  });
}
