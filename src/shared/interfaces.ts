import type { DeltaTime } from './types';

export interface IRunnable {
  start(): void;
}

export interface IAttachable<Args extends [...any] = []> {
  attach(...args: Args): void;
  detach(): void;
}

export interface IUpdatable<Args extends [DeltaTime, ...any] = [DeltaTime]> {
  update(...args: Args): void;
}
