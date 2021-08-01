// https://github.com/puppeteer/puppeteer#debugging-tips
// https://www.twilio.com/blog/how-to-build-a-cli-with-node-js

/*
// To run in REPL

node --experimental-repl-await

//--------------------------//

const puppeteer = require("puppeteer");
const browser = await puppeteer.launch({ executablePath: "/opt/homebrew/bin/chromium", headless: false });
const page = await browser.newPage();
await page.goto(`https://www.lego.com/en-us/page/static/pick-a-brick`);

async function acceptCookies(page) {
  await page.goto("https://www.lego.com", { waitUntil: "networkidle0" });
  const continueButton = await page.$('[data-test="age-gate-grown-up-cta"]');
  if (!continueButton) {
    console.log("no continue")
    return;
  }
  await continueButton.click();

  const acceptAllButton = await page.$('[data-test="cookie-accept-all"]');
  if (!continueButton) {
    console.log('no accept all');
    return;
  }
  await acceptAllButton.click();
}

await acceptCookies(page);

await page.goto(`https://www.lego.com/en-us/page/static/pick-a-brick`);

*/

/*
Figuring out the scroll offset ...

document.querySelector("[data-test='pab-search-total']").getBoundingClientRect()
document.querySelector("[data-target='pick-a-brick-scroll-desktop']").getBoundingClientRect()
document.body.getBoundingClientRect()
window.pageYOffset
*/

const puppeteer = require("puppeteer");
const ndjson = require("ndjson");
const fs = require("fs");

const ora = require('ora');
const partId = 3005;

if (3 !== process.argv.length) {
  console.log("usage: ScrapeLego.js <output-file>");
  process.exit(-1);
}

const outputFile = process.argv[2];

// Useful to add a pause,
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function acceptCookies(page) {
  await page.goto("https://www.lego.com", { waitUntil: "networkidle0" });
  const continueButton = await page.$('[data-test="age-gate-grown-up-cta"]');
  if (!continueButton) {
    console.log("no continue")
    return;
  }
  await continueButton.click();

  const acceptAllButton = await page.$('[data-test="cookie-accept-all"]');
  if (!continueButton) {
    console.log('no accept all');
    return;
  }
  await acceptAllButton.click();
}

async function extractDetails(e) {

  const detail = e.childNodes[1];

  const name = detail.childNodes[1].textContent;
  const colorFamily = detail.childNodes[2].textContent.slice(14);
  const exactColor = detail.childNodes[3].textContent.slice(13);
  const elementId = parseInt(detail.childNodes[4].textContent.slice(12));
  const designId = parseInt(detail.childNodes[5].textContent.slice(11));
  const price = parseFloat(detail.childNodes[6].textContent.slice(08));

  return {
    name, colorFamily, exactColor, elementId, designId, price
  };

  // let imgURL = null;
  // let imgHash = null;

  // let img = e.querySelector("img[class*='PreloadedImage']");
  // // while (!img) {
  // //   img = e.querySelector("img[class*='PreloadedImage']");
  // //   if (!img) { sleep(100); }
  // // }
  // if (img) {
  //   const fullImgURL = img.getAttribute("src");
  // // const img = retry(() => { return e.querySelector("img[class*='PreloadedImage']") })
  // // const fullImgURL = img.getAttribute("src");

  //   imgURL = fullImgURL ? fullImgURL.slice(0, fullImgURL.indexOf("?")) : null;
  //   imgHash = (() => {
  //     const match = /assets\/([a-zA-Z0-9]+)\//.exec(imgURL);
  //     return match ? match[1] : null
  //   })();
  // } else {
  //   sleep(10000);
  // }

  // return {
  //   name, colorFamily, exactColor, elementId, designId, price, imgURL, imgHash
  // };
}

async function closeModal(page) {
  // console.log("close modal");
  const closeButton = await page.$('[data-test="modal-close"]');
  await closeButton.click();
  await page.waitForSelector("[data-test='modal-content']", { hidden: true });
}

async function waitOnScroll(page, target) {
  while (true) {
    const offset = await page.evaluate(_ => window.pageYOffset);
    if (target === offset) { break; }
    // console.log(`offset: ${offset}; target: ${target}`);
    sleep(100);
  }
}

function getLogger(userSpinner, text) {
  if (userSpinner) {
    const spinner = ora(text).start();
    spinner.log = (text) => {};
    return spinner;
  } else {
    const logger = {
      _text: text,
      log: (text) => { console.log(text) }
    };
    Object.defineProperty(logger, "text", {
      get : function () {
          return this._text;
      },
      set : function (val) {
        this._text = val;
        console.log(val);
      }
    });
    return logger;
  }
}

function logObject(obj) {
  for (key in obj) {
    console.log(`  ${key}: ${obj[key]}`);
  }
}

// process.on("SIGINT", () => {
//   console.log("");
//   process.exit();
// });

(async () => {
    const ws = fs.createWriteStream(outputFile);
    const output = ndjson.stringify();
    output.on("data", (line) => {
      ws.write(line);
    });

    // This window/viewport munging works around a crash where the viewport snapped
    // to the window size mid-scrape.
    // https://stackoverflow.com/questions/52553311/how-to-set-max-viewport-in-puppeteer
    const defaultViewport = { width: 800, height: 600 };
    const args = [`--window-size=${defaultViewport.width},${defaultViewport.height+123}`];
    const browser = await puppeteer.launch({ executablePath: "/opt/homebrew/bin/chromium", headless: false, args });
    const page = await browser.newPage();

    // await page.goto("https://www.lego.com");
    // (await page.$('[data-test="age-gate-grown-up-cta"]')).click();
    // (await page.$('[data-test="cookie-accept-all"]')).click();
    await acceptCookies(page);

    let pieces = 0;
    let pages = 1;
    let next;

    // await page.goto(`https://www.lego.com/en-us/page/static/pick-a-brick?query=${3005}&page=1`);
    await page.goto(`https://www.lego.com/en-us/page/static/pick-a-brick`);

    // Figure out what the offset indicating "done scrolling" should be.
    await page.waitForSelector("[data-target='pick-a-brick-scroll-desktop']");
    const scrollTarget = await page.$("[data-target='pick-a-brick-scroll-desktop']");
    const boundingBox = await scrollTarget.boundingBox();
    const doneScrollingY = Math.floor(boundingBox.y) + boundingBox.height;

    //const spinner = ora(`Page ${pages} - ${pieces} pieces`).start();
    const logger = getLogger(false, `Page ${pages} - ${pieces} pieces`);

    do {
      logger.log("");

      // Other iteration attempts led to errors calling click(). ?
      // const parts = await page.$$("[data-test='pab-item']");
      logger.log("Get parts.");
      await page.waitForSelector("[data-test='pab-item']");
      let parts = await page.$$("[data-test='pab-item']");

      for (let i = 0; i < parts.length; i++) {
        logger.log("Get image.");
        const img = await parts[i].$("[data-test='pab-item-image']");
        const fullImgURL = await img.evaluate(node => node.getAttribute("src"));
        const imgURL = fullImgURL ? fullImgURL.slice(0, fullImgURL.indexOf("?")) : null;
        const imgHash = (() => {
          const match = /assets\/([a-zA-Z0-9]+)\//.exec(imgURL);
          return match ? match[1] : null
        })();

        // Best effort at making the next bit robust.
        // Clicking the part directly (await part.click()) can cause the
        // node to be recreateted, which produces a "Node is detached
        // from document" error.
        // https://github.com/puppeteer/puppeteer/issues/3496
        // Instead, scroll to the bottom-right of the parts bounding box
        // and reselect parts.
        // Sometimes the bounding box comes back null, and it's not clear why.
        logger.log("Scroll to part.");
        let boundingBox = await parts[i].boundingBox();
        if (!boundingBox) {
          console.log("No bounding box");
          // If we don't get a bounding box, try grabbing parts again.
          parts = await page.$$("[data-test='pab-item']");
          boundingBox = await parts[i].boundingBox();
        }
        if (boundingBox) {
          // console.log("has bounding box.");
          const currentOffset = await page.evaluate(_ => window.pageYOffset);
          const offset = Math.floor(currentOffset + boundingBox.y - boundingBox.height);
          console.log("Bounding box:");
          logObject(boundingBox);
          console.log(`target: ${offset}`);
          await page.evaluate(offset => window.scrollTo(0, offset), offset);
          // // If we don't get a bounding box? Hmmm ...
          // await page.mouse.move(
          //   boundingBox.x + boundingBox.width,
          //   boundingBox.y + boundingBox.height
          // );
          await waitOnScroll(page, offset);
          parts = await page.$$("[data-test='pab-item']");
        }

        logger.log("Open part modal.");
        logger.log("Click");
        parts[i].click();
        // sleep(150);

        logger.log("Wait");
        await page.waitForSelector("[data-test='modal-content']");
        logger.log("Get details");
        const detailModal = await page.$("[data-test='modal-content']");
        logger.log("Extract details.");
        const details = { ...await detailModal.evaluate(extractDetails), imgURL, imgHash };

        output.write(details);
        pieces++;
        logger.text = `Page ${pages} - ${pieces} pieces`;

        await closeModal(page);
        parts = await page.$$("[data-test='pab-item']");
      }

      // next = await page.waitForSelector("[data-test='pagination-next']")
      // await sleep(250);
      console.log("Next page.")
      next = await page.$("[data-test='pagination-next']");
      if (next) {
        // console.log("next");
        await Promise.all([
          page.waitForNavigation({ waitUntil: "networkidle0" }),
          next.click()
        ]);
        // We need a pause here for the page to scroll to the top.
        // A second _usually_ works, but not always.
        // await sleep(5000);
        // Rather than sleep a fixed time, check if the window offset is
        // at the "done scrolling to the top" position.
        // Is this a finicky magic number?
        await waitOnScroll(page, doneScrollingY);
      }
      pages++;
    } while (next)

    logger.log("Close page");
    await page.close();
    logger.log("Close browser");
    await browser.close();

    logger.log("End output");
    output.end();
    logger.log("close ws");
    ws.close();
    logger.log("Done");
})();
// } catch (ex) {
//   console.log(ex);
//   To keep browser open on error for investigation.
//   while (true) {
//     await sleep(1000);
//   }
// }

