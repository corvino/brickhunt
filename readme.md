### Debugging

The frontend tooling is packaged by [Vite](https://vitejs.dev). In lieu of a watch mode, Electron points the front end at the Vite http server. This has the advantage of supporting [HMR](https://vitejs.dev/guide/features.html#hot-module-replacement).

To run from VS Code, run `npm run debug` in a terminal to run the Vite server.

To run everything in one go use `npm start`.

### Database Construction

The info about lego parts and their attribtues is build in steps.

The LEGO.com [Pick a Brick](https://www.lego.com/en-us/page/static/pick-a-brick) presents pieces (about fourteen thousand) with a number of attributes. LEGO does not provide this information in a more conventient format, so it is scraped using [Puppeteer](https://github.com/puppeteer/puppeteer). The color table is obtained from the HTML color table on swooshable.com.

    node srcipts/ScrapeLego.js lego-data/new-scrape-data.ndjson
    curl 'https://swooshable.com/parts/colors' > lego-data/colors.html

The initial database is then build in a series of steps.

    ./scripts/BuildColorFamilies.js lego-data/new-scrape-data.ndjson > lego-data/color-families.json
    ./scripts/LoadSchema.ts
    ./scripts/LoadColors.ts
    ./scripts/LoadParts.ts
