import sirv from "sirv";
import compression from "compression";
import polka from "polka";
import bodyParser from "body-parser";
import * as sapper from "@sapper/server";
import cookie from "cookie";
import jwt from "jsonwebtoken";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { PORT, NODE_ENV, JWT_SECRET } = process.env;
const dev = NODE_ENV === "development";

polka()
  .use((request, response, next) => {
    if (typeof request.headers.cookie !== "undefined") {
      const { token } = cookie.parse(request.headers.cookie);

      if (typeof token !== "undefined" || token === "") {
        const { userId } = jwt.verify(token, JWT_SECRET);
        request.userId = userId;
      }
    }

    next();
  })
  .use(bodyParser.json())
  .use(
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    sapper.middleware({
      session: async (request, response) => {
        const { userId: id } = request;

        if (!id) {
          return {};
        }

        const person = await prisma.person.findOne({
          where: { id },
        });

        const { password, ...rest } = person;

        return {
          person: rest,
        };
      },
    })
  )
  .listen(PORT, (err: any) => {
    if (err) console.log("error", err);
  });
