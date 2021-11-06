#! /usr/bin/env ts-node

import fs from "fs";
import ndjson from "ndjson-parse";
import { createConnection } from "typeorm";

import * as entities from "../src/main/entity";

import { normalizeColor } from "./Shared";

const inputFile = "lego-data/output.ndjson";

const legoToBricklink = {
  6141: 4073,
  35381: 98138
}

type PartEntry = {
  name: string,
  colorFamily: string,
  exactColor: string,
  elementId: number,
  designId: number,
  price: number,
  imgURL: string,
  imgHash: string
}

(async () => {
  await createConnection({
    type: "sqlite",
    database: "Brickhunt.sqlite",
    entities: entities.All
  });

  const data = await fs.promises.readFile(inputFile);
  const parts: PartEntry[] = ndjson(data.toString());

  for (const part of parts) {
    let prt = await entities.Part.findOne({ where: { designId: part.designId } });
    if (!prt) {
      prt = new entities.Part();
      prt.name = part.name;
      prt.price = part.price;
      prt.designId = part.designId;
      prt.bricklinkId = (part.designId in legoToBricklink) ?
        legoToBricklink[part.designId] :
        part.designId
    }

    let colorName = normalizeColor(part.exactColor);
    let foundColor = false;
    if (prt.partColors) {
      for (const color of prt.partColors) {
        if (colorName === color.color.name) {
          foundColor = true;
        }
      }
    }

    if (!foundColor) {
      const color = await entities.Color.findOne({ where: { name: colorName } });
      if (color) {
        const partColor = new entities.PartColor();
        partColor.color = color;
        partColor.part = prt;
        partColor.elementId = part.elementId;
        partColor.imgURL = part.imgURL;

        if (prt.partColors) {
          prt.partColors = [...prt.partColors, partColor];
        } else {
          prt.partColors = [partColor];
        }
        await prt.save();
      } else {
        console.log(`Missing color: ${colorName}`);
      }
    }
  }
})();
