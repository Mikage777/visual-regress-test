/// <reference types="cypress" />
export function beforeCompareSnapshots(
  /** Element you want to modify */
  modifyElementsQuerySelectors: [string, Record<string, string>][],
  /** Main app element (if you want for the page to be loaded before triggering the command) */
  appContentQuerySelector: string = "body"
) {
  Cypress.Commands.overwrite("compareSnapshot", (originalFn, ...args) => {
    return (
      cy
        // wait for content to be ready
        .get(appContentQuerySelector)
        // hide ignored elements
        .then(($app) => {
          return new Cypress.Promise((resolve, reject) => {
            setTimeout(() => {
              for (const [selector, css] of modifyElementsQuerySelectors) {
                $app.find(selector).css(css);
              }

              resolve();
              // add a very small delay to wait for the elements to be there, but you should
              // make sure your test already handles this
            }, 300);
          });
        })
        .then(() => {
          return originalFn(...args);
        })
    );
  });
}
