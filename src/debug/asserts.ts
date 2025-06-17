const DEFAULT_ASSRTION_MESSAGE = 'Assertion failed!';

export function assert(value: unknown, assertionMessage = DEFAULT_ASSRTION_MESSAGE): asserts value {
  if (value == null) {
    debugger;
    throw new TypeError(assertionMessage);
  }
}
