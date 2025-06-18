import { isNil } from '@/shared/utils';

export type Context = WebGL2RenderingContext;
type BufferType = 'Index' | 'Vertex';

const getGlBufferTypeFromString = (context: Context, type: BufferType) => {
  if (type === 'Index') {
    return context.ELEMENT_ARRAY_BUFFER;
  }
  return context.ARRAY_BUFFER;
};

export abstract class BaseBuffer {
  protected id: WebGLBuffer;
  protected context: Context;
  protected target: GLenum;

  constructor(
    type: BufferType,
    context: Context,
    srcData?: AllowSharedBufferSource,
    usage: GLenum = context.STATIC_DRAW,
  ) {
    this.context = context;
    this.id = context.createBuffer();
    this.target = getGlBufferTypeFromString(context, type);
    this.bind();
    if (!isNil(srcData)) {
      this.setData(srcData, usage);
    }
  }

  public bind(): void {
    this.context.bindBuffer(this.target, this.id);
  }

  public setData(srcData: AllowSharedBufferSource | null, usage: GLenum = this.context.STATIC_DRAW): void {
    this.context.bufferData(this.target, srcData, usage);
  }
}
