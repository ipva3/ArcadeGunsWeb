import { assert } from '@/debug/asserts';

import { Context } from './base-buffer';
import { IndexBuffer } from './index-buffer';
import { VertexBuffer } from './vertex-buffer';
import { ShaderDataType } from './vertex-buffer-layout';

export class VertexArray {
  private id: WebGLVertexArrayObject;
  private context: Context;
  private indexBuffer?: IndexBuffer;
  private vertexBufferIndex: GLsizei = 0;
  private vertexBuffers: VertexBuffer[] = [];

  constructor(context: Context) {
    this.context = context;
    this.id = context.createVertexArray();
    this.bind();
  }

  public bind(): void {
    this.context.bindVertexArray(this.id);
  }

  public getIndexBuffer(): IndexBuffer | undefined {
    return this.indexBuffer;
  }

  public getVertexBuffers(): VertexBuffer[] {
    return this.vertexBuffers;
  }

  public setIndexBuffer(indexBuffer: IndexBuffer): void {
    this.bind();
    indexBuffer.bind();
    this.indexBuffer = indexBuffer;
  }

  public addVertexBuffer(vertexBuffer: VertexBuffer): void {
    const layout = vertexBuffer.getBufferLayout();
    assert(layout, 'Vertex buffer has no layout!');
    assert(layout.getElements().length, 'Vertex buffer has no elements in layout!');

    this.bind();
    vertexBuffer.bind();

    for (const element of layout.getElements()) {
      switch (element.type) {
        case ShaderDataType.Float:
        case ShaderDataType.Float2:
        case ShaderDataType.Float3:
        case ShaderDataType.Float4:
          {
            this.context.enableVertexAttribArray(this.vertexBufferIndex);
            this.context.vertexAttribPointer(
              this.vertexBufferIndex,
              element.getComponentCount(),
              shaderDataTypeToOpenGLBaseType(this.context, element.type),
              element.normalized,
              layout.getStride(),
              element.offset,
            );
            this.vertexBufferIndex++;
          }
          break;

        case ShaderDataType.Int:
        case ShaderDataType.Int2:
        case ShaderDataType.Int3:
        case ShaderDataType.Int4:
          {
            this.context.enableVertexAttribArray(this.vertexBufferIndex);
            this.context.vertexAttribIPointer(
              this.vertexBufferIndex,
              element.getComponentCount(),
              shaderDataTypeToOpenGLBaseType(this.context, element.type),
              layout.getStride(),
              element.offset,
            );
            this.vertexBufferIndex++;
          }
          break;

        case ShaderDataType.Mat3:
        case ShaderDataType.Mat4:
          {
            const count = element.getComponentCount();
            for (let i = 0; i < count; i++) {
              this.context.enableVertexAttribArray(this.vertexBufferIndex);
              this.context.vertexAttribPointer(
                this.vertexBufferIndex,
                count,
                shaderDataTypeToOpenGLBaseType(this.context, element.type),
                element.normalized,
                layout.getStride(),
                element.offset + 4 * count * i,
              );
              this.context.vertexAttribDivisor(this.vertexBufferIndex, 1);
              this.vertexBufferIndex++;
            }
          }
          break;
      }
    }

    this.vertexBuffers.push(vertexBuffer);
  }
}

export function shaderDataTypeToOpenGLBaseType(gl: WebGL2RenderingContext, type: ShaderDataType): GLenum {
  switch (type) {
    case ShaderDataType.Float:
      return gl.FLOAT;
    case ShaderDataType.Float2:
      return gl.FLOAT;
    case ShaderDataType.Float3:
      return gl.FLOAT;
    case ShaderDataType.Float4:
      return gl.FLOAT;
    case ShaderDataType.Mat3:
      return gl.FLOAT;
    case ShaderDataType.Mat4:
      return gl.FLOAT;
    case ShaderDataType.Int:
      return gl.INT;
    case ShaderDataType.Int2:
      return gl.INT;
    case ShaderDataType.Int3:
      return gl.INT;
    case ShaderDataType.Int4:
      return gl.INT;
  }
}
