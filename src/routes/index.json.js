const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

export async function get(req, res) {
  const allPlants = await prisma.plant.findMany();
  return res.json(allPlants);
}

export async function post(req, res) {
  const { name } = req.body;

  const created = await prisma.plant.create({
    data: {
      name
    }
  });

  return res.json(created);
}
