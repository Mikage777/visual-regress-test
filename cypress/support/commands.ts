/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to1
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//

import { addCompareSnapshotCommand } from "cypress-visual-regression/dist/command";
import { beforeCompareSnapshots } from "./beforeCompareSnapshots";

addCompareSnapshotCommand({
  errorThreshold: 0.045,
  scale: true,
});

beforeCompareSnapshots([
  ["section.sticky", { position: "static" }], // avoid sticky tabs
  ["[role=dialog].container.fixed", { visibility: "hidden" }], // hidden cookie popup
  ["div#popmechanic-snippet", { display: "none" }], // hidden mindbox
]);

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
