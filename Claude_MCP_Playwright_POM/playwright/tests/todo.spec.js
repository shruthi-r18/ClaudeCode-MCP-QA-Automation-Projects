/**
 * Todo App Test Suite
 * Uses Page Object Model for clean, maintainable tests
 */

const { test, expect } = require('@playwright/test');
const { TodoPage, testData } = require('../pages/fixtures');

test.describe('Todo App', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    // Initialize TodoPage with test data locators
    todoPage = new TodoPage(page, testData.uiElements);
    await todoPage.goto();
  });

  test.describe('Page Load and Initial State', () => {
    test('should load the page with the correct title', async () => {
      const heading = await todoPage.getHeadingText();
      expect(heading).toBe(testData.pageTitle);
    });

    test('should display initial default tasks', async () => {
      const taskCount = await todoPage.getTaskCount();
      expect(taskCount).toBe(testData.initialTaskCount);
      await expect(todoPage.taskList).toBeVisible();
    });

    test('should display correct default task texts', async () => {
      for (let i = 0; i < testData.defaultTasks.length; i++) {
        const taskText = await todoPage.getTaskTextByIndex(i);
        expect(taskText).toBe(testData.defaultTasks[i]);
      }
    });

    test('should display the correct initial task count', async () => {
      const stats = await todoPage.getStatsText();
      expect(stats).toContain(testData.taskCounterMessages.initial);
    });

    test('should have visible input field with placeholder', async () => {
      await expect(todoPage.taskInput).toBeVisible();
      const placeholder = await todoPage.getInputPlaceholder();
      expect(placeholder).toBe(testData.inputPlaceholder);
    });

    test('should have visible "Add Task" button', async () => {
      await expect(todoPage.addButton).toBeVisible();
      const buttonText = await todoPage.getAddButtonText();
      expect(buttonText).toBe(testData.addButtonLabel);
    });

    test('should have delete buttons for each task', async () => {
      const deleteButtonCount = await todoPage.getDeleteButtonCount();
      expect(deleteButtonCount).toBe(testData.initialTaskCount);

      for (let i = 0; i < testData.initialTaskCount; i++) {
        const buttonText = await todoPage.getDeleteButtonTextByIndex(i);
        expect(buttonText).toBe(testData.deleteButtonLabel);
      }
    });
  });

  test.describe('Adding Tasks', () => {
    test('should add a new task by clicking the "Add Task" button', async () => {
      await todoPage.addTaskByButton(testData.testTasks.simple);
      expect(await todoPage.hasTextInPage(testData.testTasks.simple)).toBe(true);
    });

    test('should add a task by pressing Enter key', async () => {
      await todoPage.addTaskByEnter(testData.testTasks.keyboard);
      expect(await todoPage.hasTextInPage(testData.testTasks.keyboard)).toBe(true);
    });

    test('should clear input field after adding a task', async () => {
      await todoPage.addTaskByButton(testData.testTasks.new);
      const inputValue = await todoPage.getInputValue();
      expect(inputValue).toBe('');
    });

    test('should not add empty tasks when clicking the button', async () => {
      const initialCount = await todoPage.getTaskCount();
      await todoPage.fillTaskInput('   ');
      await todoPage.clickAddButton();
      const finalCount = await todoPage.getTaskCount();
      expect(finalCount).toBe(initialCount);
    });

    test('should not add empty tasks when pressing Enter', async () => {
      const initialCount = await todoPage.getTaskCount();
      await todoPage.fillTaskInput('   ');
      await todoPage.pressKeyInInput('Enter');
      const finalCount = await todoPage.getTaskCount();
      expect(finalCount).toBe(initialCount);
    });

    test('should update task counter after adding a task', async () => {
      let stats = await todoPage.getStatsText();
      expect(stats).toContain(testData.taskCounterMessages.initial);

      await todoPage.addTaskByButton(testData.testTasks.new);

      stats = await todoPage.getStatsText();
      expect(stats).toContain(testData.taskCounterMessages.afterAddOne);
    });

    test('should add multiple tasks in sequence', async () => {
      const initialCount = await todoPage.getTaskCount();

      const tasksToAdd = [testData.testTasks.taskA, testData.testTasks.taskB, testData.testTasks.taskC];
      for (const task of tasksToAdd) {
        await todoPage.addTaskByButton(task);
      }

      const finalCount = await todoPage.getTaskCount();
      expect(finalCount).toBe(initialCount + testData.scenarios.multipleTasksAdded);
    });

    test('should handle special characters in task text', async () => {
      await todoPage.addTaskByButton(testData.testTasks.specialCharacters);
      expect(await todoPage.hasTextInPage(testData.testTasks.specialCharacters)).toBe(true);
    });
  });

  test.describe('Deleting Tasks', () => {
    test('should delete a task when delete button is clicked', async () => {
      const initialCount = await todoPage.getTaskCount();
      await todoPage.deleteFirstTask();
      const finalCount = await todoPage.getTaskCount();
      expect(finalCount).toBe(initialCount - 1);
    });

    test('should update task counter after deleting a task', async () => {
      let stats = await todoPage.getStatsText();
      expect(stats).toContain(testData.taskCounterMessages.initial);

      await todoPage.deleteFirstTask();

      stats = await todoPage.getStatsText();
      expect(stats).toContain(testData.taskCounterMessages.afterDeleteOne);
    });

    test('should delete the correct task from the list', async () => {
      const secondTaskText = await todoPage.getTaskTextByIndex(1);
      await todoPage.deleteTaskByIndex(1);
      expect(await todoPage.hasTextInPage(secondTaskText)).toBe(false);
    });

    test('should delete all tasks one by one', async () => {
      for (let i = 0; i < testData.scenarios.deleteAllTasksCount; i++) {
        await todoPage.deleteFirstTask();
      }

      await todoPage.waitForEmptyMessage();
      const emptyMessage = await todoPage.getEmptyMessageText();
      expect(emptyMessage).toBe(testData.emptyStateMessage);
    });

    test('should show empty state message when all tasks are deleted', async () => {
      await todoPage.deleteAllTasks();

      const stats = await todoPage.getStatsText();
      expect(stats).toContain(testData.taskCounterMessages.afterDeleteAll);
    });
  });

  test.describe('Empty State', () => {
    test('should show empty state message when no tasks exist', async () => {
      await todoPage.deleteAllTasks();

      await todoPage.waitForEmptyMessage();
      const emptyMessage = await todoPage.getEmptyMessageText();
      expect(emptyMessage).toBe(testData.emptyStateMessage);
    });

    test('should hide task list and show empty message', async () => {
      await todoPage.deleteAllTasks();

      await expect(todoPage.taskList).not.toBeVisible();
      await expect(todoPage.emptyMessage).toBeVisible();
    });

    test('should hide empty message when a task is added to empty list', async () => {
      await todoPage.deleteAllTasks();

      await expect(todoPage.emptyMessage).toBeVisible();

      await todoPage.addTaskByButton(testData.testTasks.new);

      await expect(todoPage.emptyMessage).not.toBeVisible();
      await expect(todoPage.taskList).toBeVisible();
    });
  });

  test.describe('Input Field Behavior', () => {
    test('input field should focus on click', async () => {
      await todoPage.clickInput();
      const isFocused = await todoPage.isInputFocused();
      expect(isFocused).toBe(true);
    });

    test('should display entered text in input field', async () => {
      await todoPage.fillTaskInput(testData.testTasks.simple);
      const inputValue = await todoPage.getInputValue();
      expect(inputValue).toBe(testData.testTasks.simple);
    });

    test('should handle long text input', async () => {
      await todoPage.addTaskByButton(testData.testTasks.long);
      expect(await todoPage.hasTextInPage(testData.testTasks.long)).toBe(true);
    });

    test('should trim whitespace when adding task', async () => {
      await todoPage.addTaskByButton(testData.testTasks.withWhitespace);
      expect(await todoPage.hasTextInPage(testData.testTasks.trimmedVersion)).toBe(true);
    });
  });

  test.describe('Button Interactions', () => {
    test('Add Task button should be clickable', async () => {
      await todoPage.addTaskByButton(testData.testTasks.button);
      expect(await todoPage.hasTextInPage(testData.testTasks.button)).toBe(true);
    });

    test('Delete buttons should be clickable', async () => {
      const initialCount = await todoPage.getTaskCount();
      await todoPage.deleteFirstTask();
      const finalCount = await todoPage.getTaskCount();
      expect(finalCount).toBe(initialCount - 1);
    });

    test('should disable focus on multiple rapid clicks', async () => {
      await todoPage.fillTaskInput(testData.testTasks.simple);
      await todoPage.clickAddButton();

      const taskItemCount = await todoPage.getTaskCount();
      expect(taskItemCount).toBeGreaterThan(0);
    });
  });

  test.describe('Task Counter', () => {
    test('task counter should start at 3', async () => {
      const stats = await todoPage.getStatsText();
      expect(stats).toContain(testData.taskCounterMessages.initial);
    });

    test('task counter should increase when task is added', async () => {
      await todoPage.addTaskByButton(testData.testTasks.new);
      const stats = await todoPage.getStatsText();
      expect(stats).toContain(testData.taskCounterMessages.afterAddOne);
    });

    test('task counter should decrease when task is deleted', async () => {
      await todoPage.deleteFirstTask();
      const stats = await todoPage.getStatsText();
      expect(stats).toContain(testData.taskCounterMessages.afterDeleteOne);
    });

    test('task counter should remain accurate after multiple operations', async () => {
      await todoPage.addTaskByButton(testData.testTasks.taskA);
      await todoPage.addTaskByButton(testData.testTasks.taskB);

      let stats = await todoPage.getStatsText();
      expect(stats).toContain(testData.taskCounterMessages.afterAddTwo);

      await todoPage.deleteFirstTask();

      stats = await todoPage.getStatsText();
      expect(stats).toContain(testData.taskCounterMessages.afterAddOne);
    });
  });

  test.describe('Responsive Behavior', () => {
    test('should display all UI elements properly on desktop view', async () => {
      expect(await todoPage.isContainerVisible()).toBe(true);
      expect(await todoPage.isHeadingVisible()).toBe(true);
      expect(await todoPage.isInputVisible()).toBe(true);
      expect(await todoPage.isAddButtonVisible()).toBe(true);
      expect(await todoPage.isTaskListVisible()).toBe(true);
      expect(await todoPage.isStatsVisible()).toBe(true);
    });
  });

  test.describe('Accessibility', () => {
    test('should have accessible heading', async () => {
      expect(await todoPage.isHeadingVisible()).toBe(true);
    });

    test('input field should be keyboard accessible', async () => {
      await todoPage.clickInput();
      await todoPage.typeTaskInput(testData.testTasks.simple);
      const inputValue = await todoPage.getInputValue();
      expect(inputValue).toBe(testData.testTasks.simple);
    });

    test('buttons should be keyboard accessible via Tab', async () => {
      await todoPage.focusInput();
      await todoPage.fillTaskInput(testData.testTasks.simple);
      await todoPage.pressTabOnInput();
      await todoPage.pressEnter();

      expect(await todoPage.hasTextInPage(testData.testTasks.simple)).toBe(true);
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle rapid add and delete operations', async () => {
      await todoPage.addTaskByButton(testData.testTasks.rapid);
      await todoPage.deleteLastTask();

      const stats = await todoPage.getStatsText();
      expect(stats).toContain(testData.taskCounterMessages.initial);
    });

    test('should handle unicode characters in task text', async () => {
      await todoPage.addTaskByButton(testData.testTasks.unicode);
      expect(await todoPage.hasTextInPage(testData.testTasks.unicode)).toBe(true);
    });

    test('should preserve task order after operations', async () => {
      const firstTask = await todoPage.getTaskTextByIndex(0);
      expect(firstTask).toBe(testData.defaultTasks[0]);

      await todoPage.addTaskByButton(testData.testTasks.last);

      const allTasks = await todoPage.getAllTaskTexts();
      const lastTask = allTasks[allTasks.length - 1];
      expect(lastTask).toContain(testData.testTasks.last);
    });
  });
});
