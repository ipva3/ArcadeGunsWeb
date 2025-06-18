import type { IRunnable } from '@/shared/interfaces';
import type { DeltaTime } from '@/shared/types';

import { EventEmitter } from './event-emitter';
import { Layer } from './layer';

interface GameEvents {
  start: undefined;
  stop: undefined;
  update: DeltaTime;
}

export class Game extends EventEmitter<GameEvents> implements IRunnable {
  private isRunning = false;
  private lastTimestamp = 0;
  private layers: Layer<any>[] = [];

  public start(): void {
    this.emit('start');
    this.isRunning = true;
    this.attachLayers();
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  public stop(): void {
    this.emit('stop');
    this.isRunning = false;
    this.detachLayers();
  }

  private gameLoop(timestamp: DOMHighResTimeStamp): void {
    if (!this.isRunning) return;

    const deltaTime = this.updateTimer(timestamp);

    this.emit('update', deltaTime);
    this.updateLayers(deltaTime);

    requestAnimationFrame(this.gameLoop.bind(this));
  }

  public addLayers(layers: Layer<any>[]): void {
    this.layers.push(...layers);
  }

  private attachLayers() {
    for (const layer of this.layers) {
      layer.attach();
    }
  }

  private detachLayers() {
    for (const layer of this.layers) {
      layer.detach();
    }
  }

  private updateLayers(deltaTime: DeltaTime) {
    for (const layer of this.layers) {
      layer.update(deltaTime);
    }
  }

  private updateTimer(timestamp: DOMHighResTimeStamp): DeltaTime {
    const deltaTime = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;
    return deltaTime as DeltaTime;
  }
}
