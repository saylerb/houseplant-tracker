const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

export async function get(req, res) {
  const allPlants = await prisma.plant.findMany();

  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify(allPlants));
}

export async function post(req, res) {
  const { name } = req.body;

  const created = await prisma.plant.create({
    data: {
      name,
      owner: {
        connect: {
          email: "sayler.b@gmail.com",
        },
      },
    },
  });

  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify(created));
}
