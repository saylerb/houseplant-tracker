const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

export async function get(req, res) {
  // TODO: Probably want to move this to the session store
  if (!req.userId) {
    res.writeHead(403);
    res.end();
    return;
  }

  const allPlants = await prisma.plant.findMany({
    where: {
      owner: {
        id: req.userId,
      },
    },
  });

  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify(allPlants));
}

export async function post(req, res) {
  const {
    body: { name },
    userId,
  } = req;

  const created = await prisma.plant.create({
    data: {
      name,
      owner: {
        connect: {
          id: userId,
        },
      },
    },
  });

  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify(created));
}
