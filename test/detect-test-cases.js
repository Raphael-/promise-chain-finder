const testCases = [
  {
    testCaseDescription: 'simple promise chains with type inference hint',
    testCasePath: './tests/fixtures/fixture.js',
    length: 1,
    expectedPromiseChains: [{
      start: 0,
      end: 36,
      isRootPromiseNode: true
    }],
  },
  {
    testCasePath: "./tests/fixtures/fixture.js",
    expectedPromiseChain: {
      length: 1,
      start: 0,
      end: 36,
      isRootPromiseNode: true
    },
  },
  {
    testCasePath: "./tests/fixtures/fixture.js",
    expectedPromiseChain: {
      length: 1,
      start: 0,
      end: 36,
      isRootPromiseNode: true
    },
  },
  {
    testCasePath: "./tests/fixtures/fixture.js",
    expectedPromiseChain: {
      length: 1,
      start: 0,
      end: 36,
      isRootPromiseNode: true
    },
  }
];
