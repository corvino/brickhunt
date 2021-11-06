#! /usr/bin/env ts-node

import fs from "fs";
import path from "path";

import addOAuthInterceptor from "axios-oauth-1.0a";
import axios from "axios";

// Create a client whose requests will be signed
const client = axios.create();

async function getPart(no)  {
  return await client({
    method: "get",
    url: `https://api.bricklink.com/api/store/v1/items/part/${no}`,
  });
}

async function getPartColors(no)  {
  return await client({
    method: "get",
    url: `https://api.bricklink.com/api/store/v1/items/part/${no}/colors`,
  });
}

(async () => {
  const auth = await fs.promises.readFile("data/bricklink-auth.json", "utf-8");
  const {consumerKey, consumerSecret, tokenValue, tokenSecret } = JSON.parse(auth);

  // Specify the OAuth options
  const options = {
    algorithm: <const> "HMAC-SHA1",
    key: consumerKey,
    secret: consumerSecret,
    token: tokenValue,
    tokenSecret: tokenSecret
  };

// Add interceptor that signs requests
addOAuthInterceptor(client, options);

  //for (let i = 0; i < 10000; i++) {
  for (let i = 0; i < 10; i++) {
    const response = await getPart(i);

    const part = (<any> response.data).data;

    if (0 < Object.entries(part).length) {
      const response = await getPartColors(i);
      const colors = (<any> response.data).data;

      if ("no" in part && "name" in part) {
        console.log(`${part.no} - ${part.name}`);
      } else {
        console.log(`${i} - ******`);
      }

      const filepath = path.join("bricklink-data/parts", `${i}.json`);
      await fs.promises.writeFile(filepath, JSON.stringify({ part, colors }, null, 4));
    }
  }
})();
