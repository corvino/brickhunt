#! /usr/bin/env ts-node

import fs from "fs";
import path from "path";

import { createConnection } from "typeorm";

import * as entities from "../src/main/entity";

const fileExists = async (path) => {
  try {
    await fs.promises.stat(path);
    return true
  } catch(error) {
    return false;
  }
}

(async () => {
  await createConnection({
    type: "sqlite",
    database: "Brickhunt.sqlite",
    entities: entities.All
  });

  const parts = await fs.promises.readdir("bricklink-data/parts");
  for await (const part of parts) {
    const filepath = path.join("bricklink-data/parts", part);
    if (await fileExists(filepath)) {
      const contents = await fs.promises.readFile(filepath, "utf-8");
      const data = JSON.parse(contents);
      const part = data.part;
      const altNos = part.alternate_no.split(",").map((n) => parseInt(n));
      const colors = data.colors.map(c => c.color_id);

      const existing = await entities.Part.find({ designId: parseInt(part.no) });

      // What do we actually want to load here?
      if (0 < existing.length) {
        for await (const alt of part.alternate_no) {

        }
      } else {
        for await (const alt of part.alternate_no) {
          const altPart = await entities.Part.find({ designId: parseInt(alt) });
          if (0 < altPart.length) {
            console.log(`${part.no} => ${alt}`);
          }
        }
      }
    }
  }
})();
