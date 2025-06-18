const DEFAULT_ASSRTION_MESSAGE = 'Assertion failed!';

export function assert(value: unknown, assertionMessage: string = DEFAULT_ASSRTION_MESSAGE): asserts value {
  if (value == null) {
    debugger;
    throw new TypeError(assertionMessage);
  }
}

export function assertCondition<T>(
  value: unknown,
  condition: boolean,
  assertionMessage: string = DEFAULT_ASSRTION_MESSAGE,
): asserts value is T {
  if (!condition) {
    debugger;
    throw new TypeError(assertionMessage);
  }
}
