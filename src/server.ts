import sirv from "sirv";
import compression from "compression";
import polka from 'polka';
import bodyParser from "body-parser";
import * as sapper from "@sapper/server";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

polka()
  .use(bodyParser.json())
  .use( 
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    sapper.middleware()
  )
  .listen(PORT, (err: any) => {
    if (err) console.log('error', err);
  });
