import { BaseBuffer, Context } from './base-buffer';
import { VertexBufferLayout } from './vertex-buffer-layout';

export class VertexBuffer extends BaseBuffer {
  private bufferLayout?: VertexBufferLayout;

  constructor(context: Context);
  constructor(context: Context, srcData: AllowSharedBufferSource, usage?: GLenum);
  constructor(context: Context, srcData?: AllowSharedBufferSource, usage: GLenum = context.STATIC_DRAW) {
    super('Vertex', context, srcData, usage);
  }

  public getBufferLayout(): VertexBufferLayout | undefined {
    return this.bufferLayout;
  }

  public setBufferLayout(bufferLayout: VertexBufferLayout): void {
    this.bufferLayout = bufferLayout;
  }
}
