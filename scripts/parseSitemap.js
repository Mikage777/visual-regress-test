import fs from "fs";
import path from "path";

const __dirname = path.resolve();

import Sitemapper from "sitemapper";
import config from "../config.json" assert { type: "json" };

const SITEMAP_NAME = "sitemap.xml";

const sitemap = new Sitemapper({
  rejectUnauthorized: false,
});

const sites = Object.entries(config.sites);

const newSites = [];

for (const [, site] of sites) {
  const paths = [];
  const { sites: urls = [] } = await sitemap.fetch(
    `${site.host}/${SITEMAP_NAME}`
  );

  for (const url of urls) {
    const { pathname: path } = new URL(url);
    paths.push(path);
  }

  newSites.push({
    host: site.host,
    paths,
  });
}

fs.writeFile(
  path.join(__dirname, "/config.json"),
  JSON.stringify({ ...config, sites: newSites }, null, 4),
  (err) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log("Config has been modify");
  }
);
