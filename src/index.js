const promiseFinder = require('./promise-chain-finder.js');

require('fs').readFile('./tests/fixtures/fixture.js', 'utf8', (err, data) => {
  if (err) {
    console.error(err);

    return;
  }
  const promiseChains = promiseFinder.findPromiseChain(data);
  console.log(`Total of ${promiseChains.length} promise(s)`);
  for (const candidate of promiseChains) {
    console.log(
      candidate.promiseChain.start,
      candidate.promiseChain.end,
      candidate.promiseChain.loc,
      candidate.isRootNodeGuaranteedPromise
    );
  }
});