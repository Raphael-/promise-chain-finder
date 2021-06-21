const promiseChainFinder = require('../../src/promise-chain-finder');
const fs = require('fs').promises;
const testCases = require('../fixtures/test-cases').cases;

// ('detect promise chains - integration', () => {

describe.each(testCases.map((testCase) => [testCase.description, testCase]))(
  'test case %s',
  (description, testCase) => {
    it(`should detect promise chains of "${description}"`, async () => {
      const content = await fs.readFile(
        require.resolve(testCase.filePath),
        'utf8'
      );
      const promiseChains = promiseChainFinder.find(content);
      expect(promiseChains).toBeDefined();
      expect(promiseChains.length).toBe(testCase.totalPromiseChains);
      testCase.promiseChains
        .sort((a, b) => a.loc.start.line - b.loc.start.line || a.loc.start.column - b.loc.start.column)
        .forEach((expectedPromiseChain, index, arr) => {
          expect(promiseChains[index].isRootNodeGuaranteedPromise).toBe(expectedPromiseChain.isRootNodeGuaranteedPromise)
          expect(promiseChains[index].node.loc.start.line).toBe(expectedPromiseChain.loc.start.line);
          expect(promiseChains[index].node.loc.start.column).toBe(expectedPromiseChain.loc.start.column);
          expect(promiseChains[index].node.loc.end.line).toBe(expectedPromiseChain.loc.end.line);
          expect(promiseChains[index].node.loc.end.column).toBe(expectedPromiseChain.loc.end.column);
        });
    });
  }
);
