# Playwright Test Cases for Todo App

This document describes the comprehensive Playwright test suite for the Todo App.

## Test Setup

The test suite includes:
- **playwright.config.ts** - Playwright configuration file
- **tests/todo.spec.ts** - Complete test suite with 50+ test cases

## Test Coverage

### 1. Page Load and Initial State (7 tests)
- Page title verification
- Initial default tasks display
- Correct default task texts
- Initial task count display
- Input field visibility and placeholder
- Add Task button visibility
- Delete buttons for each task

### 2. Adding Tasks (8 tests)
- Add task via button click
- Add task via Enter key
- Input field clears after adding
- Empty task validation (button)
- Empty task validation (Enter key)
- Task counter updates after adding
- Multiple sequential tasks
- Special characters in task text

### 3. Deleting Tasks (5 tests)
- Delete task via button click
- Task counter updates after deletion
- Correct task deletion from list
- Delete all tasks one by one
- Empty state after deletion

### 4. Empty State (3 tests)
- Empty state message visibility
- Task list hidden in empty state
- Empty message hidden when task added

### 5. Input Field Behavior (4 tests)
- Input field focus on click
- Text display in input field
- Long text handling
- Whitespace trimming

### 6. Button Interactions (3 tests)
- Add Task button clickability
- Delete button clickability
- Rapid click handling

### 7. Task Counter (4 tests)
- Initial counter value
- Counter increase on add
- Counter decrease on delete
- Counter accuracy after multiple operations

### 8. Responsive Behavior (1 test)
- Desktop view UI element display

### 9. Accessibility (3 tests)
- Heading accessibility
- Input field keyboard accessibility
- Button keyboard accessibility via Tab

### 10. Edge Cases (3 tests)
- Rapid add/delete operations
- Unicode and emoji handling
- Task order preservation

## Test Statistics
- **Total Test Cases:** 50+
- **Test Suites:** 10
- **Lines of Test Code:** 600+

## Test Organization

Tests are organized using Playwright's `test.describe()` blocks for logical grouping:
- Each describe block focuses on a specific feature or behavior
- Related tests are grouped together
- Tests follow the AAA pattern (Arrange, Act, Assert)

## Test Selectors Used

The tests use the following CSS selectors that correspond to the app's HTML:
- `.todo-container` - Main container
- `h1` - Page title
- `.task-input` - Input field for new tasks
- `.add-btn` - Add Task button
- `.task-list` - Task list container
- `.task-item` - Individual task items
- `.task-text` - Task text content
- `.delete-btn` - Delete buttons
- `.empty-message` - Empty state message
- `.stats` - Task counter section

## Running the Tests

### Installation
```bash
npm install
```

### Install Playwright browsers (if not already installed)
```bash
npx playwright install
```

### Run all tests
```bash
npx playwright test
```

### Run tests in specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run specific test file
```bash
npx playwright test tests/todo.spec.ts
```

### Run tests with specific pattern
```bash
npx playwright test -g "should add a new task"
```

### Run tests in headed mode (see browser)
```bash
npx playwright test --headed
```

### Run tests in debug mode
```bash
npx playwright test --debug
```

### View test report
```bash
npx playwright show-report
```

## Test Features

- **Cross-browser testing:** Tests run on Chromium, Firefox, and WebKit
- **Automatic screenshots:** Failed tests capture screenshots
- **Trace recording:** First-retry failures are traced for debugging
- **HTML reports:** Detailed HTML test reports with pass/fail information
- **Parallel execution:** Tests run in parallel for faster feedback
- **Server management:** Dev server is automatically started if not running

## Notes

- The test suite expects the app to be running on `http://localhost:3000`
- All tests start with a clean state by navigating to `/` before each test
- Tests use locators instead of coordinates for better maintainability
- Each test is independent and can run in any order

## CI/CD Integration

The Playwright configuration includes CI-specific settings:
- Retries are enabled in CI environments
- Single worker mode in CI to prevent port conflicts
- Screenshots and traces on failure for debugging

To run in CI, set the `CI` environment variable:
```bash
CI=true npx playwright test
```
