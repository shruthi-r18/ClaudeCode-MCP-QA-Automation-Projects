# Todo App - Page Object Model Testing

This directory contains the refactored test suite using the Page Object Model (POM) design pattern for improved maintainability and scalability.

## Folder Structure

```
playwright/
├── testdata/
│   └── testData.js          # All test data and constants
├── pages/
│   ├── TodoPage.js          # Page Object with all locators and methods
│   └── fixtures.js          # Test fixtures for easy page object initialization
└── tests/
    └── todo.spec.js         # Test specifications (clean, no UI logic)
```

## File Descriptions

### `testdata/testData.js`
Centralized repository for all test data and constants. This prevents hard-coded values in tests.

**Contains:**
- Page content (title, URL)
- Default task data
- UI element labels and messages
- Test task inputs
- All expected values and messages
- UI element locators
- Test scenario constants

**Usage:**
```javascript
const testData = require('../testdata/testData');

// Access test data
console.log(testData.pageTitle);           // 'My Todo List'
console.log(testData.defaultTasks);        // ['Learn React', 'Build a todo app', 'Master JavaScript']
console.log(testData.uiElements.taskInput); // '.task-input'
```

### `pages/TodoPage.js`
Page Object Model class that encapsulates all UI interactions and locators.

**Key Features:**
- Constructor-based locator initialization
- All page locators defined in constructor
- Page-level methods for interactions (click, fill, verify, etc.)
- No test logic - only UI interaction methods

**Constructor:**
```javascript
constructor(page, locators)
```

**Common Methods:**
- `goto()` - Navigate to the page
- `addTaskByButton(taskText)` - Add task via button click
- `addTaskByEnter(taskText)` - Add task via Enter key
- `deleteFirstTask()` - Delete the first task
- `deleteAllTasks()` - Delete all tasks
- `getTaskCount()` - Get number of tasks
- `getHeadingText()` - Get page heading text
- `getStatsText()` - Get task counter text
- `isInputVisible()` - Check if input is visible
- And many more...

### `pages/fixtures.js`
Playwright test fixtures that automatically initialize the TodoPage for each test.

**Usage:**
```javascript
const { test, TodoPage, testData } = require('../pages/fixtures');

test('example', async ({ todoPage }) => {
  // todoPage is automatically initialized
  await todoPage.addTaskByButton('Test task');
});
```

### `tests/todo.spec.js`
Test specification file containing all test cases.

**Characteristics:**
- Clean, readable test code
- No UI interaction logic
- All locators come from page object
- All test data from testdata folder
- Tests focus on behavior and validation
- Uses page object methods for all interactions

## How to Use

### Running Tests
```bash
cd todo-app

# Run all tests
npx playwright test

# Run specific test file
npx playwright test playwright/tests/todo.spec.js

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests with UI
npx playwright test --ui
```

### Adding a New Test

1. **Add test data to `testdata/testData.js`** (if needed)
   ```javascript
   // Add under appropriate section
   newTestTask: 'New test data'
   ```

2. **Add page method to `TodoPage.js`** (if needed)
   ```javascript
   async myNewMethod() {
     // Implementation
   }
   ```

3. **Write test in `tests/todo.spec.js`**
   ```javascript
   test('should do something', async () => {
     // Use testData and todoPage methods
     await todoPage.addTaskByButton(testData.testTasks.newTestTask);
     expect(await todoPage.hasTextInPage(testData.testTasks.newTestTask)).toBe(true);
   });
   ```

### Adding a New Locator

1. **Add locator to `testdata/testData.js`** under `uiElements`
   ```javascript
   uiElements: {
     newElement: '.new-element-class'
   }
   ```

2. **Add property to `TodoPage` constructor**
   ```javascript
   this.newElement = page.locator(locators.newElement);
   ```

3. **Add methods to interact with the element**
   ```javascript
   async interactWithNewElement() {
     // Implementation
   }
   ```

## Benefits of This Structure

### 1. **Maintainability**
- Changes to UI selectors only require updates to `TodoPage.js`
- Test files remain unchanged when UI locators change
- Centralized test data makes updates easy

### 2. **Readability**
- Test files are clean and focus on test logic
- Method names describe user actions clearly
- No CSS selectors in test files

### 3. **Reusability**
- Page object methods can be reused across multiple tests
- Test data can be reused across multiple test files
- Fixtures provide consistent setup for all tests

### 4. **Scalability**
- Easy to add new page objects for new pages
- Simple to extend with new test data
- Methods are composable for complex scenarios

### 5. **No Hard-Coded Values**
- All test data in one place
- Easy to update expected values
- Reduces bugs from copy-paste errors

## Best Practices

### ✅ DO
- Use page object methods in tests
- Keep all locators in the constructor
- Store test data in testdata folder
- Use descriptive method names
- Keep methods single-responsibility
- Use fixtures for automatic setup

### ❌ DON'T
- Hard-code CSS selectors in tests
- Hard-code test data in tests
- Put test logic in page objects
- Create methods that do multiple things
- Change locators without updating testdata
- Skip using fixtures

## Page Object Method Naming Convention

Methods follow these patterns:

- **Navigation:** `goto()`, `navigate()`
- **Getters:** `get[Element]Text()`, `get[Element]Value()`, `get[Element]Count()`
- **Setters/Actions:** `fill[Element]()`, `click[Element]()`, `[action][Element]()`
- **Visibility:** `is[Element]Visible()`, `wait[Element]()`
- **Checks:** `has[Something]()`, `contains[Something]()`

## Test Data Organization

Test data is organized by category:
- `pageTitle` - Page content
- `defaultTasks` - Initial data
- `inputPlaceholder` - Form labels
- `taskCounterMessages` - Expected output values
- `testTasks` - Test input values
- `uiElements` - Selectors
- `scenarios` - Test parameters

## Running Specific Test Suites

```bash
# Run only Page Load and Initial State tests
npx playwright test --grep "Page Load and Initial State"

# Run tests matching pattern
npx playwright test --grep "should add"

# Run tests excluding pattern
npx playwright test --grep-invert "Responsive"
```

## Debugging Tests

```bash
# Run with debug mode
npx playwright test --debug

# Run single test with debug
npx playwright test playwright/tests/todo.spec.js -g "should add a new task"

# Generate trace for debugging
npx playwright test --trace on
```

## View Test Report

```bash
npx playwright show-report
```

---

**Last Updated:** January 13, 2026

For more information on Page Object Model:
- [Playwright Best Practices](https://playwright.dev/docs/pom)
- [Page Object Model Pattern](https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/)
