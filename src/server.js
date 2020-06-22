const { PrismaClient } = require("@prisma/client");
var express = require("express");
var app = express();
var cors = require("cors");
const port = 3000;

const prisma = new PrismaClient();

app.get("/", cors(), async function(req, res) {
  const allPlants = await prisma.plant.findMany();
  return res.json(allPlants);
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
