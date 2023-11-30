import "reflect-metadata";

import { DIService, tsyringeDependencyRegistryEngine } from "@discordx/di";
import { container, injectable, singleton } from "tsyringe";

@singleton()
class Database {
  database: string;

  constructor() {
    console.log("I am database");
    this.database = new Date().toString();
  }

  query() {
    return this.database;
  }
}

@injectable()
export class Example {
  constructor(database: Database) {
    console.log(database.query());
  }
}

DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container);
DIService.engine.addService(Example);
DIService.engine.getService(Example);
