import "reflect-metadata";

import { container, injectable, singleton } from "tsyringe";

import {
  DIService,
  tsyringeDependencyRegistryEngine,
} from "../../src/index.js";

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
DIService.instance.addService(Example);
DIService.instance.getService(Example);
