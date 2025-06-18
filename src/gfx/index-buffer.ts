import { BaseBuffer, Context } from './base-buffer';

export class IndexBuffer extends BaseBuffer {
  constructor(context: Context);
  constructor(context: Context, srcData: AllowSharedBufferSource, usage?: GLenum);
  constructor(context: Context, srcData?: AllowSharedBufferSource, usage: GLenum = context.STATIC_DRAW) {
    super('Index', context, srcData, usage);
  }
}
