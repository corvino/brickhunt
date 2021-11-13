const fs = require("fs");
const path = require("path");

const fileExists = async (path) => {
  try {
    await fs.promises.stat(path);
    return true
  } catch(error) {
    return false;
  }
}

(async () => {
  for (let i = 0; i < 10000; i++) {
    const filepath = path.join("bricklink-data/parts", `${i}.json`);

    if (await fileExists(filepath)) {
      const data = await fs.promises.readFile(filepath);
      const part = JSON.parse(data);

      // if (0 === Object.entries(part).length) {
      //   console.log(filepath);
      //   await fs.promises.unlink(filepath);
      // }
      if ("no" in part && "name" in part) {
        console.log(`${part.no} - ${part.name}`);
      }
    }
  }
})();
