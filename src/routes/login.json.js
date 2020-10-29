const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

const bcrypt = require("bcrypt");

const SALT_ROUNDS = 12;

export async function post(req, res) {
  const { name, email, password } = req.body;

  const user = await prisma.person.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error(`User ${email} not found`);
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw new Error("Password incorrect");
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    })
  );

  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  const { password: removed, ...rest } = user;

  res.end(JSON.stringify(rest));
}
