import "reflect-metadata";

import { container, singleton } from "tsyringe";

import {
  DIService,
  tsyringeDependencyRegistryEngine,
} from "../../src/index.js";

@singleton()
class Database {
  database: string;

  constructor() {
    console.log("I am database");
    this.database = "you are connected to database!!";
  }

  query() {
    return this.database;
  }
}

@singleton()
export class Example {
  constructor(database: Database) {
    console.log(database.query());
  }
}

DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container);
DIService.instance.addService(Example);
