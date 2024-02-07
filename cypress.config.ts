import { defineConfig } from "cypress";
import cypressMochawesomeReporter from "cypress-mochawesome-reporter/plugin";
import { configureVisualRegression } from "cypress-visual-regression/dist/plugin";
import fs from "fs";

export default defineConfig({
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "cypress/report",
    reportFilename: "report",
    reportPageTitle: "Report",
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
  },
  e2e: {
    supportFile: "cypress/support/e2e.{js,jsx,ts,tsx}",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    chromeWebSecurity: false,
    // experimentalSessionAndOrigin: true,
    experimentalInteractiveRunEvents: true,
    viewportWidth: 1366,
    viewportHeight: 768,
    video: false,
    screenshotsFolder:
      process.env.REGRESS_TYPE === "base"
        ? "cypress/snapshots/base"
        : "cypress/snapshots/actual",
    trashAssetsBeforeRuns: true,
    screenshotOnRunFailure: true,

    setupNodeEvents(on, config) {
      on("after:spec", (spec) => {
        const specName = spec.name.slice(spec.name.lastIndexOf("/") + 1);
        const pathActual = `cypress/snapshots/actual/${specName}`;
        const pathDiff = `cypress/snapshots/diff/${specName}`;

        if (fs.existsSync(pathActual) && fs.existsSync(pathDiff)) {
          const filesDiff = fs.readdirSync(pathDiff);

          filesDiff.forEach((file) => {
            const oldPath = pathDiff + `/${file}`;
            const newFileName = file.replace("diff", "actual");
            const newPath = pathActual + `/${newFileName}`;

            fs.renameSync(oldPath, newPath);
          });
        }
      });

      on(
        "before:browser:launch",
        (
          browser: Cypress.Browser,
          launchOptions: Cypress.BeforeBrowserLaunchOptions
        ) => {
          if (browser.family === "chromium") {
            launchOptions.args.push("--force-color-profile=srgb");
            launchOptions.args.push("--disable-low-res-tiling");
            launchOptions.args.push("--disable-smooth-scrolling");
          }

          return launchOptions;
        }
      );

      configureVisualRegression(on);
      cypressMochawesomeReporter(on);
    },
  },
});
