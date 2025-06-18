import type { IAttachable, IUpdatable } from '@/shared/interfaces';
import type { DeltaTime } from '@/shared/types';

import { View, type Context, type RenderingContextMap, type RenderingContextOptionsMap } from './view';

export abstract class Layer<Ctx extends Context> implements IAttachable, IUpdatable {
  protected name: string;
  protected view: View<Ctx>;
  protected context: RenderingContextMap[Ctx];
  protected containerId: string;

  constructor(
    name: string,
    containerId: string,
    x: number,
    y: number,
    width: number,
    height: number,
    context: Ctx,
    options?: RenderingContextOptionsMap[Ctx],
  ) {
    this.name = name;
    this.view = new View(name, x, y, width, height, context, options);
    this.context = this.view.getContext();
    this.containerId = containerId;
  }

  public abstract attach(): void;
  public abstract detach(): void;
  public abstract update(timestamp: DeltaTime): void;
}
