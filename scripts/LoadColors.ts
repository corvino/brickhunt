#! /usr/bin/env ts-node

import fs from "fs";
import { createConnection } from "typeorm";

import * as entities from "../src/main/entity";

type ColorEntry = {
  colorId: number,
  material: string,
  legoId: number,
  legoName: string,
  legoAbbreviation: string,
  brickColorstream: string,
  bricklinkId: number,
  bricklinkName: string,
  ldrawId: number,
  ldrawName: string,
  peeronName: string,
  otherName: string,
  rarity: string,
  firstSeen: string,
  lastSeen: string,
  notes: string,
  hex: string
}

(async () => {
  await createConnection({
    type: "sqlite",
    database: "Brickhunt.sqlite",
    entities: entities.All
  });

  // Build table to lookup color family.
  const familyData = (await fs.promises.readFile("lego-data/color-families.json")).toString();
  const colorFamilies: {[key: string]: string[]} = JSON.parse(familyData);
  const colorToFamily: {[key: string]: entities.ColorFamily} = {};

  for (const [family, colors] of Object.entries(colorFamilies)) {
    const colorFamily = new entities.ColorFamily();
    colorFamily.name = family;
    await colorFamily.save();

    colors.forEach((color) => {
      colorToFamily[color] = colorFamily;
    });
  };

  const colorData = (await fs.promises.readFile("lego-data/colors.json")).toString();
  const colors: ColorEntry[] = JSON.parse(colorData);
  for (const color of colors) {
    if ("legoName" in color) {
      const cl = new entities.Color();
      const name = color.legoName;

      cl.name = name;
      cl.legoId = color.legoId;
      cl.bricklinkId = color.bricklinkId;
      if (name in colorToFamily) {
        cl.family = colorToFamily[name];
      }

      await cl.save();
    }
  };
})();
