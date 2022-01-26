import { importx } from "../../../importer/build/cjs/index.cjs";
import { Koa } from "../../build/cjs/Koa.js";

const server = new Koa();

async function start() {
  await importx(__dirname + "/routes/**/*.{js,ts}");
  await server.build();

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`server started on port ${port}`);
  });
}

start();
