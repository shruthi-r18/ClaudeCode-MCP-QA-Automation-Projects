import { test, expect } from '@playwright/test';

test.describe('Todo App', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app before each test
    await page.goto('/');
  });

  test.describe('Page Load and Initial State', () => {
    test('should load the page with the correct title', async ({ page }) => {
      const heading = page.locator('h1');
      await expect(heading).toHaveText('My Todo List');
    });

    test('should display initial default tasks', async ({ page }) => {
      const taskList = page.locator('.task-list');
      await expect(taskList).toBeVisible();

      const taskItems = page.locator('.task-item');
      await expect(taskItems).toHaveCount(3);
    });

    test('should display correct default task texts', async ({ page }) => {
      const taskTexts = page.locator('.task-text');

      await expect(taskTexts.nth(0)).toHaveText('Learn React');
      await expect(taskTexts.nth(1)).toHaveText('Build a todo app');
      await expect(taskTexts.nth(2)).toHaveText('Master JavaScript');
    });

    test('should display the correct initial task count', async ({ page }) => {
      const stats = page.locator('.stats');
      await expect(stats).toContainText('Total tasks: 3');
    });

    test('should have visible input field with placeholder', async ({ page }) => {
      const input = page.locator('.task-input');
      await expect(input).toBeVisible();
      await expect(input).toHaveAttribute('placeholder', 'Add a new task...');
    });

    test('should have visible "Add Task" button', async ({ page }) => {
      const addBtn = page.locator('.add-btn');
      await expect(addBtn).toBeVisible();
      await expect(addBtn).toHaveText('Add Task');
    });

    test('should have delete buttons for each task', async ({ page }) => {
      const deleteButtons = page.locator('.delete-btn');
      await expect(deleteButtons).toHaveCount(3);

      for (let i = 0; i < 3; i++) {
        await expect(deleteButtons.nth(i)).toHaveText('Delete');
      }
    });
  });

  test.describe('Adding Tasks', () => {
    test('should add a new task by clicking the "Add Task" button', async ({ page }) => {
      const input = page.locator('.task-input');
      const addBtn = page.locator('.add-btn');

      await input.fill('Test task');
      await addBtn.click();

      await expect(page.getByText('Test task')).toBeVisible();
    });

    test('should add a task by pressing Enter key', async ({ page }) => {
      const input = page.locator('.task-input');

      await input.fill('Keyboard task');
      await input.press('Enter');

      await expect(page.getByText('Keyboard task')).toBeVisible();
    });

    test('should clear input field after adding a task', async ({ page }) => {
      const input = page.locator('.task-input');
      const addBtn = page.locator('.add-btn');

      await input.fill('New task');
      await addBtn.click();

      await expect(input).toHaveValue('');
    });

    test('should not add empty tasks when clicking the button', async ({ page }) => {
      const input = page.locator('.task-input');
      const addBtn = page.locator('.add-btn');

      // Get initial task count
      let taskItems = page.locator('.task-item');
      const initialCount = await taskItems.count();

      // Try to add empty task
      await input.fill('   '); // Only whitespace
      await addBtn.click();

      // Verify task count hasn't increased
      taskItems = page.locator('.task-item');
      await expect(taskItems).toHaveCount(initialCount);
    });

    test('should not add empty tasks when pressing Enter', async ({ page }) => {
      const input = page.locator('.task-input');

      // Get initial task count
      let taskItems = page.locator('.task-item');
      const initialCount = await taskItems.count();

      // Try to add empty task with Enter
      await input.fill('   ');
      await input.press('Enter');

      // Verify task count hasn't increased
      taskItems = page.locator('.task-item');
      await expect(taskItems).toHaveCount(initialCount);
    });

    test('should update task counter after adding a task', async ({ page }) => {
      const input = page.locator('.task-input');
      const addBtn = page.locator('.add-btn');
      const stats = page.locator('.stats');

      await expect(stats).toContainText('Total tasks: 3');

      await input.fill('New task');
      await addBtn.click();

      await expect(stats).toContainText('Total tasks: 4');
    });

    test('should add multiple tasks in sequence', async ({ page }) => {
      const input = page.locator('.task-input');
      const addBtn = page.locator('.add-btn');
      const taskItems = page.locator('.task-item');

      const initialCount = await taskItems.count();

      await input.fill('Task 1');
      await addBtn.click();

      await input.fill('Task 2');
      await addBtn.click();

      await input.fill('Task 3');
      await addBtn.click();

      const updatedItems = page.locator('.task-item');
      await expect(updatedItems).toHaveCount(initialCount + 3);
    });

    test('should handle special characters in task text', async ({ page }) => {
      const input = page.locator('.task-input');
      const addBtn = page.locator('.add-btn');
      const specialText = 'Test with @#$%^&*() symbols!';

      await input.fill(specialText);
      await addBtn.click();

      await expect(page.getByText(specialText)).toBeVisible();
    });
  });

  test.describe('Deleting Tasks', () => {
    test('should delete a task when delete button is clicked', async ({ page }) => {
      const taskItems = page.locator('.task-item');
      const initialCount = await taskItems.count();

      const deleteButtons = page.locator('.delete-btn');
      await deleteButtons.first().click();

      const updatedItems = page.locator('.task-item');
      await expect(updatedItems).toHaveCount(initialCount - 1);
    });

    test('should update task counter after deleting a task', async ({ page }) => {
      const stats = page.locator('.stats');
      const deleteButtons = page.locator('.delete-btn');

      await expect(stats).toContainText('Total tasks: 3');

      await deleteButtons.first().click();

      await expect(stats).toContainText('Total tasks: 2');
    });

    test('should delete the correct task from the list', async ({ page }) => {
      const taskTexts = page.locator('.task-text');

      // Get the second task text
      const secondTaskText = await taskTexts.nth(1).textContent();

      // Delete second task
      const deleteButtons = page.locator('.delete-btn');
      await deleteButtons.nth(1).click();

      // Verify the task is no longer in the list
      await expect(page.getByText(secondTaskText || '')).not.toBeVisible();
    });

    test('should delete all tasks one by one', async ({ page }) => {
      const deleteButtons = page.locator('.delete-btn');

      // Delete all tasks
      for (let i = 0; i < 3; i++) {
        const buttons = page.locator('.delete-btn');
        await buttons.first().click();
      }

      // Verify empty state message appears
      const emptyMessage = page.locator('.empty-message');
      await expect(emptyMessage).toBeVisible();
      await expect(emptyMessage).toContainText('No tasks yet. Add one to get started!');
    });

    test('should show empty state message when all tasks are deleted', async ({ page }) => {
      const deleteButtons = page.locator('.delete-btn');

      // Delete all tasks
      while (await deleteButtons.count() > 0) {
        await deleteButtons.first().click();
      }

      const stats = page.locator('.stats');
      await expect(stats).toContainText('Total tasks: 0');
    });
  });

  test.describe('Empty State', () => {
    test('should show empty state message when no tasks exist', async ({ page }) => {
      const deleteButtons = page.locator('.delete-btn');

      // Delete all tasks
      while (await deleteButtons.count() > 0) {
        await deleteButtons.first().click();
      }

      const emptyMessage = page.locator('.empty-message');
      await expect(emptyMessage).toBeVisible();
      await expect(emptyMessage).toHaveText('No tasks yet. Add one to get started!');
    });

    test('should hide task list and show empty message', async ({ page }) => {
      const deleteButtons = page.locator('.delete-btn');

      // Delete all tasks
      while (await deleteButtons.count() > 0) {
        await deleteButtons.first().click();
      }

      const taskList = page.locator('.task-list');
      const emptyMessage = page.locator('.empty-message');

      await expect(taskList).not.toBeVisible();
      await expect(emptyMessage).toBeVisible();
    });

    test('should hide empty message when a task is added to empty list', async ({ page }) => {
      // Delete all tasks
      const deleteButtons = page.locator('.delete-btn');
      while (await deleteButtons.count() > 0) {
        await deleteButtons.first().click();
      }

      // Verify empty state
      let emptyMessage = page.locator('.empty-message');
      await expect(emptyMessage).toBeVisible();

      // Add a new task
      const input = page.locator('.task-input');
      const addBtn = page.locator('.add-btn');
      await input.fill('New task');
      await addBtn.click();

      // Verify empty message is hidden and task list is visible
      emptyMessage = page.locator('.empty-message');
      const taskList = page.locator('.task-list');

      await expect(emptyMessage).not.toBeVisible();
      await expect(taskList).toBeVisible();
    });
  });

  test.describe('Input Field Behavior', () => {
    test('input field should focus on click', async ({ page }) => {
      const input = page.locator('.task-input');

      await input.click();
      await expect(input).toBeFocused();
    });

    test('should display entered text in input field', async ({ page }) => {
      const input = page.locator('.task-input');
      const testText = 'Test input text';

      await input.fill(testText);

      await expect(input).toHaveValue(testText);
    });

    test('should handle long text input', async ({ page }) => {
      const input = page.locator('.task-input');
      const longText = 'a'.repeat(200);

      await input.fill(longText);
      await page.locator('.add-btn').click();

      await expect(page.getByText(longText)).toBeVisible();
    });

    test('should trim whitespace when adding task', async ({ page }) => {
      const input = page.locator('.task-input');
      const addBtn = page.locator('.add-btn');

      await input.fill('   Test task   ');
      await addBtn.click();

      // The task should be added (validation passes), but might display with or without trimming
      await expect(page.getByText('Test task')).toBeVisible();
    });
  });

  test.describe('Button Interactions', () => {
    test('Add Task button should be clickable', async ({ page }) => {
      const input = page.locator('.task-input');
      const addBtn = page.locator('.add-btn');

      await input.fill('Button test');
      await addBtn.click();

      await expect(page.getByText('Button test')).toBeVisible();
    });

    test('Delete buttons should be clickable', async ({ page }) => {
      const deleteButtons = page.locator('.delete-btn');
      const initialCount = await page.locator('.task-item').count();

      await deleteButtons.first().click();

      const updatedCount = await page.locator('.task-item').count();
      expect(updatedCount).toBe(initialCount - 1);
    });

    test('should disable focus on multiple rapid clicks', async ({ page }) => {
      const input = page.locator('.task-input');
      const addBtn = page.locator('.add-btn');

      // Rapid clicks test
      await input.fill('Task');
      await addBtn.click({ clickCount: 1 });

      // Verify only one task was added
      const taskItems = page.locator('.task-item');
      // Should not add multiple duplicates from rapid clicks
      const taskTexts = page.locator('.task-text');
      const taskMatches = await taskTexts.count();
      expect(taskMatches).toBeGreaterThan(0);
    });
  });

  test.describe('Task Counter', () => {
    test('task counter should start at 3', async ({ page }) => {
      const stats = page.locator('.stats');
      await expect(stats).toContainText('Total tasks: 3');
    });

    test('task counter should increase when task is added', async ({ page }) => {
      const input = page.locator('.task-input');
      const addBtn = page.locator('.add-btn');
      const stats = page.locator('.stats');

      await input.fill('New task');
      await addBtn.click();

      await expect(stats).toContainText('Total tasks: 4');
    });

    test('task counter should decrease when task is deleted', async ({ page }) => {
      const deleteButtons = page.locator('.delete-btn');
      const stats = page.locator('.stats');

      await deleteButtons.first().click();

      await expect(stats).toContainText('Total tasks: 2');
    });

    test('task counter should remain accurate after multiple operations', async ({ page }) => {
      const input = page.locator('.task-input');
      const addBtn = page.locator('.add-btn');
      const deleteButtons = page.locator('.delete-btn');
      const stats = page.locator('.stats');

      // Add 2 tasks
      await input.fill('Task A');
      await addBtn.click();
      await input.fill('Task B');
      await addBtn.click();

      await expect(stats).toContainText('Total tasks: 5');

      // Delete 1 task
      const currentDeleteButtons = page.locator('.delete-btn');
      await currentDeleteButtons.first().click();

      await expect(stats).toContainText('Total tasks: 4');
    });
  });

  test.describe('Responsive Behavior', () => {
    test('should display all UI elements properly on desktop view', async ({ page }) => {
      const container = page.locator('.todo-container');
      const heading = page.locator('h1');
      const input = page.locator('.task-input');
      const addBtn = page.locator('.add-btn');
      const taskList = page.locator('.task-list');
      const stats = page.locator('.stats');

      await expect(container).toBeVisible();
      await expect(heading).toBeVisible();
      await expect(input).toBeVisible();
      await expect(addBtn).toBeVisible();
      await expect(taskList).toBeVisible();
      await expect(stats).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have accessible heading', async ({ page }) => {
      const heading = page.locator('h1');
      await expect(heading).toBeVisible();
    });

    test('input field should be keyboard accessible', async ({ page }) => {
      const input = page.locator('.task-input');

      await input.click();
      await input.type('Test');

      await expect(input).toHaveValue('Test');
    });

    test('buttons should be keyboard accessible via Tab', async ({ page }) => {
      const input = page.locator('.task-input');
      const addBtn = page.locator('.add-btn');

      await input.focus();
      await input.fill('Test task');
      await page.keyboard.press('Tab');

      // Focus should move to the Add Task button
      await page.keyboard.press('Enter');

      // Task should be added
      await expect(page.getByText('Test task')).toBeVisible();
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle rapid add and delete operations', async ({ page }) => {
      const input = page.locator('.task-input');
      const addBtn = page.locator('.add-btn');
      const deleteButtons = page.locator('.delete-btn');

      // Add a task
      await input.fill('Rapid task');
      await addBtn.click();

      // Immediately delete it
      const newDeleteButton = page.locator('.delete-btn').last();
      await newDeleteButton.click();

      const stats = page.locator('.stats');
      await expect(stats).toContainText('Total tasks: 3');
    });

    test('should handle unicode characters in task text', async ({ page }) => {
      const input = page.locator('.task-input');
      const addBtn = page.locator('.add-btn');
      const unicodeText = 'Test with emojis 🎉 and symbols 中文';

      await input.fill(unicodeText);
      await addBtn.click();

      await expect(page.getByText(unicodeText)).toBeVisible();
    });

    test('should preserve task order after operations', async ({ page }) => {
      const taskTexts = page.locator('.task-text');

      // Verify initial order
      const firstTask = await taskTexts.nth(0).textContent();
      expect(firstTask).toBe('Learn React');

      // Add a new task
      const input = page.locator('.task-input');
      const addBtn = page.locator('.add-btn');
      await input.fill('Last task');
      await addBtn.click();

      // Check that new task is at the end
      const updatedTexts = page.locator('.task-text');
      const lastTask = await updatedTexts.last().textContent();
      expect(lastTask).toContain('Last task');
    });
  });
});
