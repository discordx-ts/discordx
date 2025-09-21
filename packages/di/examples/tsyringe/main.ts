/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
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
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Example {
  constructor(database: Database) {
    console.log(database.query());
  }
}

DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container);
DIService.engine.addService(Example);
DIService.engine.getService(Example);
