const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const bcrypt = require("bcrypt");

const SALT_ROUNDS = 12;

export async function post(req, res) {
  const { name, email, password } = req.body;

  console.log(req.body);

  const created = await prisma.person.create({
    data: {
      name,
      email,
      password: await bcrypt.hash(password, SALT_ROUNDS),
    },
  });

  console.log("created person:", created);

  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify(created));
}
