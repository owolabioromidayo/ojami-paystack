const CONSOLE_FAIL_TYPES = ['error'];

// Override console methods to throw errors
CONSOLE_FAIL_TYPES.forEach((type) => {
  const originalConsoleMethod = console[type];

  console[type] = (...args) => {
    originalConsoleMethod.apply(console, args); // Call the original method
    throw new Error(`Failing due to console.${type} while running test!\n\n${args.join(' ')}`);
  };
});