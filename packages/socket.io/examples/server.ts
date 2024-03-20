/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { importx } from "@discordx/importer";
import { Koa } from "@discordx/koa";
import { Server } from "@discordx/socket.io";
import http from "http";

const app = new Koa();
const server = http.createServer(app.callback());
const io = new Server(server);

async function main() {
  await importx(`${__dirname}/{api,sockets}/**/*.{js,ts}`);
  await app.build();
  await io.build();
  server.listen(3000, () => {
    console.log("server started....");
  });
}

main();
