const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

export async function get(req, res) {
  const { slug } = req.params;

  const data = await prisma.plant.findOne({ where: { id: parseInt(slug) } });

  return res.json(data);
}

export async function put(req, res) {
  const { slug } = req.params;

  const { lastWateredAt } = req.body;

  const lastWateredAtDate = new Date(lastWateredAt);

  const updated = await prisma.plant.update({
    where: { id: parseInt(slug) },
    data: {
      lastWateredAt: lastWateredAtDate
    }
  });

  return res.json(updated);
}

export async function del(req, res) {
  const { slug } = req.params;

  const deleted = await prisma.plant.delete({
    where: { id: parseInt(slug) }
  });

  return res.json(deleted);
}

export async function post(req, res) {
  const { slug } = req.params;

  const { name } = req.body;

  const created = await prisma.plant.create({
    data: {
      name
    }
  });
}
