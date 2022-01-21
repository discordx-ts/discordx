import { DGuard, Server } from "../../index.js";
import { DWs } from "../index.js";
import { Decorator } from "@discordx/internal";
import { Socket } from "socket.io";

export abstract class Method extends Decorator {
  protected _socket!: DWs;
  protected _guards: DGuard[] = [];

  get socket(): DWs {
    return this._socket;
  }
  set socket(value: DWs) {
    this._socket = value;
  }

  get guards(): DGuard[] {
    return [
      ...this._socket.guards,
      ...this._guards,
      DGuard.create(this._method?.bind(this._socket.instance)),
    ];
  }
  set guards(value: DGuard[]) {
    this._guards = value;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler(server: Server, socket?: Socket): any {
    const globalGuards = server.guards.map((guard) =>
      DGuard.create(guard.bind(undefined))
    );
    return (...params: unknown[]) => {
      return this.getGuardFunction(globalGuards, server, socket)(params);
    };
  }

  /**
   * Execute a guard with params
   */
  getGuardFunction(
    globalGuards: DGuard[],
    server: Server,
    socket?: Socket
  ): (params: unknown[]) => Promise<unknown> {
    const next = async (params: [], index: number) => {
      const nextFn = () => next(params, index + 1);
      const guardToExecute = [...globalGuards, ...this.guards][index];
      let res: unknown;

      if (index >= [...globalGuards, ...this.guards].length - 1) {
        // If it's the main method
        res = await (guardToExecute?.fn as (...[]) => unknown)(
          // method(...ParsedOptions, [Interaction, Client], ...) => method(...ParsedOptions, Interaction, Client, ...)
          ...params,
          server,
          socket
        );
      } else {
        // If it's the guards
        // method([Interaction, Client])
        res = await (guardToExecute?.fn as (...[]) => unknown)(
          ...params,
          server,
          socket,
          nextFn
        );
      }

      if (res) {
        return res;
      }

      return;
    };

    return (...params: []) => next(params, 0);
  }
}
