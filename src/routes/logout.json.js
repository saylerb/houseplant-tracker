const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

const bcrypt = require("bcrypt");

export async function get(req, res) {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
    })
  );

  res.writeHead(200);

  res.end("You are successfully logged out");
}
