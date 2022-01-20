import { Koa } from "../../koa/build/cjs/index.js";
import { Server } from "../build/cjs/index.js";
import http from "http";
import { importx } from "@discordx/importer";

const app = new Koa();
const server = http.createServer(app.callback());
const io = new Server(server);

async function main() {
  await importx(__dirname + "/{api,sockets}/**/*.{js,ts}");
  await app.build();
  await io.build();
  server.listen(3000, () => {
    console.log("server started....");
  });
}

main();
