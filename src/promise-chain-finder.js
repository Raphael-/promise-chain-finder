const esquery = require("esquery");
const parser = require("acorn");

const DETECT_PROMISE_CHAIN_QUERIES = [
  'CallExpression[callee.property.name="then"]',
  'CallExpression[callee.property.name="catch"]',
  'CallExpression[callee.property.name="finally"]',
];

const DETECT_PROMISE_CALL = [
  'MemberExpression[object.name="Promise"][property.name="resolve"]',
  'MemberExpression[object.name="Promise"][property.name="reject"]',
  'MemberExpression[object.name="Promise"][property.name="all"]',
  'MemberExpression[object.name="Promise"][property.name="allSettled"]',
  'MemberExpression[object.name="Promise"][property.name="any"]',
  'MemberExpression[object.name="Promise"][property.name="race"]',
  'MemberExpression[object.type="NewExpression"][object.callee.name="Promise"]',
];

const find = (code) => {
  const ast = parser.parse(code, { ecmaVersion: 2020, locations: true, sourceType: 'module' });
  return DETECT_PROMISE_CHAIN_QUERIES.map((promiseChainQuery) =>
    esquery(ast, promiseChainQuery)
  )
    .reduce(concatToSingleArray, [])
    .filter(filterDuplicateCallExpressions)
    .map(addTypeInferenceHint);
};

const filterDuplicateCallExpressions = (
  currentCandidatePromiseChain,
  index,
  array
) => {
  if (index - 1 < 0) {
    return true;
  }
  const previousCandidatePromiseChain = array[index - 1];
  return (
    previousCandidatePromiseChain.start !== currentCandidatePromiseChain.start
  );
};

const concatToSingleArray = (currentValue, initialValue) =>
  initialValue.concat(currentValue);

const addTypeInferenceHint = (currentPromiseChain) => {
  return {
    node: currentPromiseChain,
    isRootNodeGuaranteedPromise:
      isRootNodeGuaranteedPromise(currentPromiseChain),
  };
};

const isRootNodeGuaranteedPromise = (currentPromiseChain) => {
  return DETECT_PROMISE_CALL.map((rootNodePromiseRule) =>
    esquery(currentPromiseChain, rootNodePromiseRule)
  )
    .reduce(concatToSingleArray, [])
    .some((promiseCall) => currentPromiseChain.start === promiseCall.start);
};

module.exports.find = find;
