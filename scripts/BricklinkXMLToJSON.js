const fs = require("fs");
const xml2js = require("xml2js");

if (3 !== process.argv.length) {
  console.log("usage: BricklinkXMLToJSON.js <xml-file>");
  process.exit(-1);
}

(async () => {
  const contents = await fs.promises.readFile(process.argv[2]);
  const parser = new xml2js.Parser({
    normalize: true,
    normalizeTags: true
  });
  const data = await parser.parseStringPromise(contents);
  const cleaned = data["inventory"]["item"].map(item =>
    Object.fromEntries(Object.entries(item).map(([k, v]) => [k, v[0]]))
  );
  console.log(JSON.stringify(cleaned, null, 2));
})();
