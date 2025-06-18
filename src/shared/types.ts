export type Brand<K, T> = K & { __brand: T };

export type Timestamp = Brand<DOMHighResTimeStamp, 'Timestamp'>;

export type DeltaTime = Brand<number, 'DelaTime'>;

export type NonEmptyString = `${string}${any}`;
