#! /usr/bin/env ts-node

import { createConnection } from "typeorm";

import * as entities from "../src/main/entity";

(async () => {
  await createConnection({
    type: "sqlite",
    database: "Brickhunt.sqlite",
    entities: entities.All,
    synchronize: true
  });
})();
