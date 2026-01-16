/**
 * Todo Page Object Model
 * Contains all locators and page-level interactions for the Todo app
 */

class TodoPage {
  /**
   * Constructor with page object and locator initialization
   * @param {Page} page - Playwright page object
   * @param {Object} locators - Object containing all UI locators
   */
  constructor(page, locators) {
    this.page = page;

    // Initialize all locators from the locators object
    this.container = page.locator(locators.container);
    this.heading = page.locator(locators.heading);
    this.taskInput = page.locator(locators.taskInput);
    this.addButton = page.locator(locators.addButton);
    this.taskList = page.locator(locators.taskList);
    this.taskItem = page.locator(locators.taskItem);
    this.taskText = page.locator(locators.taskText);
    this.deleteButton = page.locator(locators.deleteButton);
    this.stats = page.locator(locators.stats);
    this.emptyMessage = page.locator(locators.emptyMessage);
  }

  /**
   * Navigate to the todo app page
   */
  async goto() {
    await this.page.goto('/');
  }

  /**
   * Get the page heading text
   * @returns {Promise<string>} The heading text
   */
  async getHeadingText() {
    return await this.heading.textContent();
  }

  /**
   * Get the count of task items
   * @returns {Promise<number>} The number of task items
   */
  async getTaskCount() {
    return await this.taskItem.count();
  }

  /**
   * Get text of a specific task by index
   * @param {number} index - The index of the task
   * @returns {Promise<string>} The task text
   */
  async getTaskTextByIndex(index) {
    return await this.taskText.nth(index).textContent();
  }

  /**
   * Get all task texts
   * @returns {Promise<string[]>} Array of task texts
   */
  async getAllTaskTexts() {
    const count = await this.taskText.count();
    const texts = [];
    for (let i = 0; i < count; i++) {
      texts.push(await this.taskText.nth(i).textContent());
    }
    return texts;
  }

  /**
   * Get the stats text
   * @returns {Promise<string>} The stats text
   */
  async getStatsText() {
    return await this.stats.textContent();
  }

  /**
   * Get the input field value
   * @returns {Promise<string>} The input field value
   */
  async getInputValue() {
    return await this.taskInput.inputValue();
  }

  /**
   * Get the input field placeholder
   * @returns {Promise<string>} The placeholder text
   */
  async getInputPlaceholder() {
    return await this.taskInput.getAttribute('placeholder');
  }

  /**
   * Get the add button text
   * @returns {Promise<string>} The button text
   */
  async getAddButtonText() {
    return await this.addButton.textContent();
  }

  /**
   * Get the count of delete buttons
   * @returns {Promise<number>} The number of delete buttons
   */
  async getDeleteButtonCount() {
    return await this.deleteButton.count();
  }

  /**
   * Get the delete button text by index
   * @param {number} index - The index of the delete button
   * @returns {Promise<string>} The button text
   */
  async getDeleteButtonTextByIndex(index) {
    return await this.deleteButton.nth(index).textContent();
  }

  /**
   * Get the empty state message text
   * @returns {Promise<string>} The empty state message
   */
  async getEmptyMessageText() {
    return await this.emptyMessage.textContent();
  }

  /**
   * Fill the input field with text
   * @param {string} text - The text to enter
   */
  async fillTaskInput(text) {
    await this.taskInput.fill(text);
  }

  /**
   * Type text into the input field character by character
   * @param {string} text - The text to type
   */
  async typeTaskInput(text) {
    await this.taskInput.type(text);
  }

  /**
   * Clear the input field
   */
  async clearTaskInput() {
    await this.taskInput.clear();
  }

  /**
   * Press a key in the input field
   * @param {string} key - The key to press (e.g., 'Enter')
   */
  async pressKeyInInput(key) {
    await this.taskInput.press(key);
  }

  /**
   * Add a task by filling input and clicking the add button
   * @param {string} taskText - The task text to add
   */
  async addTaskByButton(taskText) {
    await this.fillTaskInput(taskText);
    await this.addButton.click();
  }

  /**
   * Add a task by filling input and pressing Enter
   * @param {string} taskText - The task text to add
   */
  async addTaskByEnter(taskText) {
    await this.fillTaskInput(taskText);
    await this.pressKeyInInput('Enter');
  }

  /**
   * Click the add button
   */
  async clickAddButton() {
    await this.addButton.click();
  }

  /**
   * Delete a task by index
   * @param {number} index - The index of the task to delete
   */
  async deleteTaskByIndex(index) {
    await this.deleteButton.nth(index).click();
  }

  /**
   * Delete the first task
   */
  async deleteFirstTask() {
    await this.deleteButton.first().click();
  }

  /**
   * Delete the last task
   */
  async deleteLastTask() {
    await this.deleteButton.last().click();
  }

  /**
   * Delete all tasks one by one
   */
  async deleteAllTasks() {
    while (await this.deleteButton.count() > 0) {
      await this.deleteButton.first().click();
    }
  }

  /**
   * Click on the input field
   */
  async clickInput() {
    await this.taskInput.click();
  }

  /**
   * Focus on the input field
   */
  async focusInput() {
    await this.taskInput.focus();
  }

  /**
   * Press Tab key on the input field
   */
  async pressTabOnInput() {
    await this.page.keyboard.press('Tab');
  }

  /**
   * Press Enter key on the page
   */
  async pressEnter() {
    await this.page.keyboard.press('Enter');
  }

  /**
   * Check if container is visible
   * @returns {Promise<boolean>} Whether container is visible
   */
  async isContainerVisible() {
    return await this.container.isVisible();
  }

  /**
   * Check if heading is visible
   * @returns {Promise<boolean>} Whether heading is visible
   */
  async isHeadingVisible() {
    return await this.heading.isVisible();
  }

  /**
   * Check if input field is visible
   * @returns {Promise<boolean>} Whether input field is visible
   */
  async isInputVisible() {
    return await this.taskInput.isVisible();
  }

  /**
   * Check if add button is visible
   * @returns {Promise<boolean>} Whether add button is visible
   */
  async isAddButtonVisible() {
    return await this.addButton.isVisible();
  }

  /**
   * Check if task list is visible
   * @returns {Promise<boolean>} Whether task list is visible
   */
  async isTaskListVisible() {
    return await this.taskList.isVisible();
  }

  /**
   * Check if stats is visible
   * @returns {Promise<boolean>} Whether stats is visible
   */
  async isStatsVisible() {
    return await this.stats.isVisible();
  }

  /**
   * Check if empty message is visible
   * @returns {Promise<boolean>} Whether empty message is visible
   */
  async isEmptyMessageVisible() {
    return await this.emptyMessage.isVisible();
  }

  /**
   * Check if input field is focused
   * @returns {Promise<boolean>} Whether input field is focused
   */
  async isInputFocused() {
    return await this.taskInput.evaluate(el => el === document.activeElement);
  }

  /**
   * Wait for empty message to be visible
   */
  async waitForEmptyMessage() {
    await this.emptyMessage.waitFor({ state: 'visible' });
  }

  /**
   * Wait for task list to be visible
   */
  async waitForTaskList() {
    await this.taskList.waitFor({ state: 'visible' });
  }

  /**
   * Wait for empty message to be hidden
   */
  async waitForEmptyMessageHidden() {
    await this.emptyMessage.waitFor({ state: 'hidden' });
  }

  /**
   * Get text content of a specific locator
   * @param {Object} locator - The locator to get text from
   * @returns {Promise<string>} The text content
   */
  async getTextContent(locator) {
    return await locator.textContent();
  }

  /**
   * Check if an element with specific text exists
   * @param {string} text - The text to search for
   * @returns {Promise<boolean>} Whether element with text exists
   */
  async hasTextInPage(text) {
    const locator = this.page.getByText(text);
    return await locator.isVisible().catch(() => false);
  }
}

module.exports = TodoPage;
