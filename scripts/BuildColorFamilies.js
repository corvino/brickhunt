#! /usr/bin/env node

const fs = require("fs");
const ndjson = require("ndjson-parse");
const { normalizeColor } = require("./Shared");

if (3 !== process.argv.length) {
  console.log("usage: BuildColorFamiles.js <lego-info.json>");
  process.exit(-1);
}

const inputFile = process.argv[2];

(async () => {
  const data = await fs.promises.readFile(inputFile);
  const parts = ndjson(data.toString());
  const colors = {};
  parts.forEach((part) => {
    const family = part["colorFamily"];
    let color = normalizeColor(part["exactColor"]);

    if (family in colors) {
      if (-1 == colors[family].indexOf(color)) {
        colors[family].push(color);
      }
    } else {
      colors[family] = [color];
    }
  });

  // FIXME: We get some strange parts in the color families
  // that needs to be fixed. For now just drop these.
  delete colors["right Orange"];
  delete colors["edium Azur"];
  delete colors["right Blue"];

  console.log(JSON.stringify(colors, null, 2));
})();
