const promiseChainFinder = require("../../src/promise-chain-finder.js");
const fs = require("fs").promises;

describe("Detect promise chains", () => {
  it("should return promise chain with then", () => {
    const promiseChains = promiseChainFinder.find(
      "Promise.resolve(1).then(e => e)"
    );
    expect(promiseChains).toBeDefined();
    expect(promiseChains.length).toBe(1);
    expect(promiseChains[0].isRootNodeGuaranteedPromise).toBe(true);
    expect(promiseChains[0].node.start).toBe(0);
    expect(promiseChains[0].node.end).toBe(31);
  });
  it("should return promise chain with catch", () => {
    const promiseChains = promiseChainFinder.find(
      "Promise.resolve(1).catch(e => e)"
    );
    expect(promiseChains).toBeDefined();
    expect(promiseChains.length).toBe(1);
    expect(promiseChains[0].isRootNodeGuaranteedPromise).toBe(true);
    expect(promiseChains[0].node.start).toBe(0);
    expect(promiseChains[0].node.end).toBe(32);
  });
  it("should return promise chain with finally", () => {
    const promiseChains = promiseChainFinder.find(
      "Promise.resolve(1).finally(e => e)"
    );
    expect(promiseChains).toBeDefined();
    expect(promiseChains.length).toBe(1);
    expect(promiseChains[0].isRootNodeGuaranteedPromise).toBe(true);
    expect(promiseChains[0].node.start).toBe(0);
    expect(promiseChains[0].node.end).toBe(34);
  });
  it("should return promise chain with then/catch/finally combined", () => {
    const promiseChains = promiseChainFinder.find(
      "Promise.resolve(1).then(t => t).catch(e => e).finally(f => f)"
    );
    expect(promiseChains).toBeDefined();
    expect(promiseChains.length).toBe(1);
    expect(promiseChains[0].isRootNodeGuaranteedPromise).toBe(true);
    expect(promiseChains[0].node.start).toBe(0);
    expect(promiseChains[0].node.end).toBe(61);
  });

  it("should return nested promise chain with then/catch/finally combined", () => {
    const promiseChains = promiseChainFinder.find(
      "Promise.resolve(1).then(t => Promise.resolve(2).then(q => q*q)).catch(e => e).finally(f => f)"
    );
    expect(promiseChains).toBeDefined();
    expect(promiseChains.length).toBe(2);
    expect(promiseChains[0].isRootNodeGuaranteedPromise).toBe(true);
    expect(promiseChains[0].node.start).toBe(0);
    expect(promiseChains[0].node.end).toBe(93);

    expect(promiseChains[1].isRootNodeGuaranteedPromise).toBe(true);
    expect(promiseChains[1].node.start).toBe(29);
    expect(promiseChains[1].node.end).toBe(62);
  });

  it("should properly recognize all as guaranteed promise", () => {
    const promiseChains = promiseChainFinder.find(
      "Promise.all(Promise.resolve(1)).catch(e => e)"
    );
    expect(promiseChains).toBeDefined();
    expect(promiseChains.length).toBe(1);
    expect(promiseChains[0].isRootNodeGuaranteedPromise).toBe(true);
    expect(promiseChains[0].node.start).toBe(0);
    expect(promiseChains[0].node.end).toBe(45);
  });

  it("should properly recognize allSettled as guaranteed promise", () => {
    const promiseChains = promiseChainFinder.find(
      "Promise.allSettled(Promise.resolve(1)).catch(e => e)"
    );
    expect(promiseChains).toBeDefined();
    expect(promiseChains.length).toBe(1);
    expect(promiseChains[0].isRootNodeGuaranteedPromise).toBe(true);
    expect(promiseChains[0].node.start).toBe(0);
    expect(promiseChains[0].node.end).toBe(52);
  });

  it("should properly recognize any as guaranteed promise", () => {
    const promiseChains = promiseChainFinder.find(
      "Promise.any(Promise.resolve(1)).catch(e => e)"
    );
    expect(promiseChains).toBeDefined();
    expect(promiseChains.length).toBe(1);
    expect(promiseChains[0].isRootNodeGuaranteedPromise).toBe(true);
    expect(promiseChains[0].node.start).toBe(0);
    expect(promiseChains[0].node.end).toBe(45);
  });

  it("should properly recognize race as guaranteed promise", () => {
    const promiseChains = promiseChainFinder.find(
      "Promise.race(Promise.resolve(1)).catch(e => e)"
    );
    expect(promiseChains).toBeDefined();
    expect(promiseChains.length).toBe(1);
    expect(promiseChains[0].isRootNodeGuaranteedPromise).toBe(true);
    expect(promiseChains[0].node.start).toBe(0);
    expect(promiseChains[0].node.end).toBe(46);
  });

  it("should properly recognize new Promise as guaranteed promise", () => {
    const promiseChains = promiseChainFinder.find(
      "new Promise((resolve, reject) => resolve(1)).catch(e => e)"
    );
    expect(promiseChains).toBeDefined();
    expect(promiseChains.length).toBe(1);
    expect(promiseChains[0].isRootNodeGuaranteedPromise).toBe(true);
    expect(promiseChains[0].node.start).toBe(0);
    expect(promiseChains[0].node.end).toBe(58);
  });

  it("should not recognize invalid root as guaranteed promise", () => {
    const promiseChains = promiseChainFinder.find(
      "maybeNotAPromise.catch(e => e)"
    );
    expect(promiseChains).toBeDefined();
    expect(promiseChains.length).toBe(1);
    expect(promiseChains[0].isRootNodeGuaranteedPromise).toBe(false);
    expect(promiseChains[0].node.start).toBe(0);
    expect(promiseChains[0].node.end).toBe(30);
  });

  it("should return empty array on empty code file", () => {
    const promiseChains = promiseChainFinder.find("");
    expect(promiseChains).toBeDefined();
    expect(promiseChains.length).toBe(0);
  });

  it("single promise calls will not be returned", () => {
    const promiseChains = promiseChainFinder.find("Promise.resolve(1)");
    expect(promiseChains).toBeDefined();
    expect(promiseChains.length).toBe(0);
  });
});
