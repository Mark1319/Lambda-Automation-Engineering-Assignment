# Automation Engineering Assignment

Playwright test suite for the Amazon search and add-to-cart scenarios.

## Covered Scenarios

- Search Amazon for an iPhone, print the selected product price, and add it to the cart.
- Search Amazon for a Samsung Galaxy device, print the selected product price, and add it to the cart.
- Run both scenarios in parallel through Playwright's `fullyParallel` configuration.

## Prerequisites

- Node.js 18 or newer
- npm

## Setup

```bash
npm install
npx playwright install
```

## Run Tests

```bash
npm test
```

Run with a visible browser:

```bash
npm run test:headed
```

Open the HTML report:

```bash
npm run test:report
```

## Notes

Amazon can show CAPTCHA or bot checks during automated runs. If that happens, rerun locally in headed mode or use a cloud/grid environment with an allowed test configuration.

## Project Structure

```text
pages/amazon-page.ts      Amazon page actions and locators
tests/homepage.spec.ts    Assignment test cases
playwright.config.ts      Parallel execution and browser configuration
package.json              Dependencies and npm scripts
```
