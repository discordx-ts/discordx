import { Get, Koa, Router } from "../../koa/build/cjs/index.js";
import { Guard, Next, On, Once, Server, Ws } from "../build/cjs/index.js";
import { Context } from "koa";
import { Socket } from "socket.io";
import fs from "fs";
import http from "http";

const readFile = function (src: string) {
  return new Promise(function (resolve, reject) {
    fs.readFile(src, { encoding: "utf8" }, function (err, data) {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
};

@Router()
@Ws()
export class Example {
  @On("connection")
  @Guard((socket: Socket, server: Server, xsocket: unknown, next: Next) => {
    console.log("I am mdw");
    return next();
  })
  on(): void {
    console.log("I am @onx");
  }

  @On("disconnect")
  disconnect(): void {
    console.log("I am disconnect");
  }

  @Once("connection")
  once(): void {
    console.log("I am @Once");
  }

  @Get("/")
  async web(context: Context): Promise<void> {
    context.body = await readFile(__dirname + "/index.html");
  }
}

const app = new Koa();
const server = http.createServer(app.callback());
const io = new Server(server);

async function main() {
  await app.build();
  await io.build();
  server.listen(3000, () => {
    console.log("server started....");
  });
}

main();
