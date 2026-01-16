/**
 * Test Data and Constants for Todo App Tests
 * All hard-coded values are centralized here to avoid duplication
 */

const testData = {
  // Page Content
  pageTitle: 'My Todo List',
  pageUrl: '/',

  // Initial Default Tasks
  defaultTasks: [
    'Learn React',
    'Build a todo app',
    'Master JavaScript'
  ],

  // Initial Task Count
  initialTaskCount: 3,

  // Input Field
  inputPlaceholder: 'Add a new task...',

  // Button Labels
  addButtonLabel: 'Add Task',
  deleteButtonLabel: 'Delete',

  // Task Counter Messages
  taskCounterMessages: {
    initial: 'Total tasks: 3',
    afterAddOne: 'Total tasks: 4',
    afterAddTwo: 'Total tasks: 5',
    afterDeleteOne: 'Total tasks: 2',
    afterDeleteAll: 'Total tasks: 0'
  },

  // Empty State Messages
  emptyStateMessage: 'No tasks yet. Add one to get started!',

  // Test Task Inputs
  testTasks: {
    simple: 'Test task',
    keyboard: 'Keyboard task',
    new: 'New task',
    button: 'Button test',
    rapid: 'Rapid task',
    last: 'Last task',
    taskA: 'Task A',
    taskB: 'Task B',
    taskC: 'Task 3',
    long: 'a'.repeat(200),
    withWhitespace: '   Test task   ',
    trimmedVersion: 'Test task',
    specialCharacters: 'Test with @#$%^&*() symbols!',
    unicode: 'Test with emojis 🎉 and symbols 中文'
  },

  // Validation Messages
  validationMessages: {
    emptyOnWhitespace: 'Cannot add task with only whitespace',
    cannotAddEmpty: 'Cannot add empty task'
  },

  // UI Elements
  uiElements: {
    container: '.todo-container',
    heading: 'h1',
    taskInput: '.task-input',
    addButton: '.add-btn',
    taskList: '.task-list',
    taskItem: '.task-item',
    taskText: '.task-text',
    deleteButton: '.delete-btn',
    stats: '.stats',
    emptyMessage: '.empty-message'
  },

  // Test Scenarios
  scenarios: {
    deleteAllTasksCount: 3,
    rapidClickCount: 1,
    longTextLength: 200,
    multipleTasksToAdd: 3,
    multipleTasksAdded: 3
  }
};

module.exports = testData;
