/**
 * Test Fixtures for Page Object Model
 * Provides initialized page objects for tests
 */

const { test: base } = require('@playwright/test');
const TodoPage = require('./TodoPage');
const testData = require('../testdata/testData');

/**
 * Extended test fixture with TodoPage
 */
const test = base.extend({
  /**
   * TodoPage fixture - provides an initialized TodoPage for tests
   */
  todoPage: async ({ page }, use) => {
    // Create a new instance of TodoPage with the page and locators
    const todoPage = new TodoPage(page, testData.uiElements);

    // Navigate to the app before each test
    await todoPage.goto();

    // Pass the todoPage to the test
    await use(todoPage);
  }
});

module.exports = { test, TodoPage, testData };
