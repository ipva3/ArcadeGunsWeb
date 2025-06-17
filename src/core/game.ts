import type { IRunnable } from '@/shared/interfaces';
import type { DeltaTime } from '@/shared/types';

import { GuiLayer, Layer, WorldLayer } from './layer';

export class Game implements IRunnable {
  private isRunning = false;
  private lastTimestamp = 0;
  private layers: Layer<any>[] = [];

  public start(): void {
    this.isRunning = true;

    const worldLayer = new WorldLayer('game');
    const guiLayer = new GuiLayer('game');
    this.layers.push(worldLayer, guiLayer);
    this.attachLayers();

    requestAnimationFrame(this.gameLoop.bind(this));
  }

  public stop(): void {
    this.isRunning = false;
    this.detachLayers();
  }

  private gameLoop(timestamp: DOMHighResTimeStamp): void {
    if (!this.isRunning) return;

    const deltaTime = this.updateTimer(timestamp);

    this.updateLayers(deltaTime);

    requestAnimationFrame(this.gameLoop.bind(this));
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
