const fs = require("fs");
const xmldom = require("xmldom");

if (3 !== process.argv.length) {
  console.log("usage: ParseColors.js <html-file>");
  process.exit(-1);
}


(async () => {
  const contents = await fs.promises.readFile(process.argv[2]);
  const doc = new xmldom.DOMParser().parseFromString(contents.toString(), "text/html");

  const body = doc.getElementsByTagName("tbody");
  const childs = body.item(0).childNodes;

  const colors = [];
  for (let i = 0; i < childs.length; i++) {
    let row = childs.item(i);
    if ("tr" === row.nodeName) {
      const colorId = row.getAttribute("data-colorid");
      const material = row.childNodes.item(1).textContent;
      const legoId = row.childNodes.item(3).textContent;
      const legoName = row.childNodes.item(5).textContent;
      const legoAbbreviation = row.childNodes.item(7).textContent;

      let brickColorstream = "";
      if (1 < row.childNodes.item(9).childNodes.length) {
        const anchor = row.childNodes.item(9).childNodes.item(1);
        if ("a" === anchor.nodeName) {
          brickColorstream = anchor.getAttribute("href");
        }
      }

      const bricklinkId = row.childNodes.item(11).textContent;
      const bricklinkName = row.childNodes.item(13).textContent;
      const ldrawId = row.childNodes.item(15).textContent;
      const ldrawName = row.childNodes.item(17).textContent;
      const peeronName = row.childNodes.item(19).textContent;
      const otherName = row.childNodes.item(21).textContent;
      const rarity = row.childNodes.item(23).textContent;
      const firstSeen = row.childNodes.item(25).textContent;
      const lastSeen = row.childNodes.item(27).textContent;
      const notes = row.childNodes.item(29).textContent;
      const hex = row.childNodes.item(31).textContent.trim();

      const color = {
        colorId, material, legoId, legoName,
        legoAbbreviation, brickColorstream, bricklinkId, bricklinkName,
        ldrawId, ldrawName, peeronName, otherName,
        rarity, firstSeen, lastSeen, notes, hex
      };
      colors.push(color);
    }
  };

  console.log(JSON.stringify(colors, null, 2));
})();
