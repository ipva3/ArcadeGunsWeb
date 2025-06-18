import { assert } from '@/debug/asserts';

export type Context = '2d' | 'bitmaprenderer' | 'webgl' | 'webgl2';

export interface RenderingContextMap {
  '2d': CanvasRenderingContext2D;
  bitmaprenderer: ImageBitmapRenderingContext;
  webgl: WebGLRenderingContext;
  webgl2: WebGL2RenderingContext;
}

export interface RenderingContextOptionsMap {
  '2d': CanvasRenderingContext2DSettings;
  bitmaprenderer: ImageBitmapRenderingContextSettings;
  webgl: WebGLContextAttributes;
  webgl2: WebGLContextAttributes;
}

export class View<Ctx extends Context> {
  private context: RenderingContextMap[Ctx];
  private canvas: HTMLCanvasElement;

  constructor(
    name: string,
    x: number,
    y: number,
    width: number,
    height: number,
    context: Ctx,
    options?: RenderingContextOptionsMap[Ctx],
  ) {
    const canvasEl = document.createElement('canvas');
    canvasEl.dataset['layerName'] = name;
    canvasEl.style.position = 'absolute';
    canvasEl.style.top = `${String(y)}px`;
    canvasEl.style.left = `${String(x)}px`;
    canvasEl.width = width;
    canvasEl.height = height;
    this.canvas = canvasEl;

    window.addEventListener('resize', this.resizeEvent.bind(this));

    const ctx = canvasEl.getContext(context, options) as RenderingContextMap[Ctx] | null;
    assert(ctx, `Context '${context}' is not supported!`);
    this.context = ctx;
  }

  public getContext(): RenderingContextMap[Ctx] {
    return this.context;
  }

  public show(containerId: string): void {
    this.canvas.remove();
    const container = document.getElementById(containerId);
    assert(container, `Element with id '${containerId}' was not found!`);
    container.appendChild(this.canvas);
  }

  public hide(): void {
    this.canvas.remove();
  }

  public move(x: number, y: number): void {
    this.canvas.style.top = `${String(y)}px`;
    this.canvas.style.left = `${String(x)}px`;
  }

  public resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
    const context = this.getContext();
    if (context instanceof WebGL2RenderingContext || context instanceof WebGLRenderingContext) {
      context.viewport(0, 0, width, height);
    }
  }

  private resizeEvent() {
    const { width, height } = document.documentElement.getBoundingClientRect();
    this.resize(width, height);
  }
}
