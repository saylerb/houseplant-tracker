const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

export async function get(request, response) {
  const { userId: id } = request;

  if (id) {
    const person = await prisma.person.findOne({
      where: { id },
    });

    const { password, ...rest } = person;

    response.writeHead(200, {
      "Content-Type": "application/json",
    });

    response.end(JSON.stringify(rest));
  } else {
    response.writeHead(404, {
      "Content-Type": "application/json",
    });

    response.end();
  }
}
