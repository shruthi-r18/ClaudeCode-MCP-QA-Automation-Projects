refactor existing tests into Page Object Model with constructor-based locators. 
Folder structure requirements:
- playwright/
  - testdata/
    - Store all test data and validation error messages
	- All test data and expected values must be read from the testdata folder.
    - Hard-coded values in tests are not allowed.
  - pages/
    - Implement Page Object Model
    - Store all page locators and page-level logic
  - tests/
    - Spec files containing only test cases
    - No UI logic in test files
    - Tests must call methods from the pages folder and validate results
Guidelines:
- Use Playwright with JavaScript
- Follow Page Object Model best practices
- Keep code clean, modular, and maintainable
- Do NOT execute or run the tests
