module.exports = {
  testEnvironment: 'node',
  reporters: [
      "default",
      "jest-junit"
  ],
  verbose: false,
  setupFiles: ["<rootDir>/spec/setupTests.js"]
};
