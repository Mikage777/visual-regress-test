/// <reference types="cypress" />
import config from "../../config.json";

describe("Регресс отображения страниц", {}, () => {
  const sites = Object.entries(config.sites);

  before(() => {
    cy.setCookie("cookie", "true");
  });

  for (const [, site] of sites) {
    describe(`Регресс отображения сайта ${site.host}`, () => {
      for (const path of site.paths) {
        const pagePath = `${site.host}${path}`;

        it(`Страница ${path}`, () => {
          cy.visit(pagePath);

          const screenshotName = pagePath
            .replace(/https?:\/\//, "")
            .replaceAll(/[\\/]/g, "-");

          cy.compareSnapshot(screenshotName);
        });
      }
    });
  }
});
