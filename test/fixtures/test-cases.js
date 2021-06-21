const TEST_CASES = [
  {
    description: 'then-redis',
    filePath: '../fixtures/then-redis.js',
    totalPromiseChains: 4,
    promiseChains: [
      {
        isRootNodeGuaranteedPromise: false,
        loc: {
          start: {
            line: 7,
            column: 6,
          },
          end: {
            line: 11,
            column: 7,
          },
        },
      },
      {
        isRootNodeGuaranteedPromise: false,
        loc: {
          start: {
            line: 8,
            column: 8,
          },
          end: {
            line: 10,
            column: 10,
          },
        },
      },
    ],
  },
  {
    description: 'axios',
    filePath: '../fixtures/axios.js',
    totalPromiseChains: 2,
    promiseChains: [
      {
        isRootNodeGuaranteedPromise: false,
        loc: {
          start: {
            line: 88,
            column: 16,
          },
          end: {
            line: 88,
            column: 58,
          },
        },
      },
      {
        isRootNodeGuaranteedPromise: false,
        loc: {
          start: {
            line: 114,
            column: 14,
          },
          end: {
            line: 114,
            column: 94,
          },
        },
      },
    ],
  },
];

module.exports.cases = TEST_CASES;
