export class VertexBufferLayout {
  private elements: VertexBufferElement[] = [];
  private stride: GLsizei = 0;

  constructor(elements: IBufferElement[]) {
    this.elements = elements.map(({ type, name, normalized }) => new VertexBufferElement(type, name, normalized));
    this.calculateStrideAndOffset();
  }

  public getElements(): VertexBufferElement[] {
    return this.elements;
  }

  public getElementCount(): GLsizei {
    return this.elements.length;
  }

  public getStride(): GLsizei {
    return this.stride;
  }

  private calculateStrideAndOffset() {
    let offset: GLsizei = 0;
    this.stride = 0;
    for (const element of this.elements) {
      element.offset = offset;
      offset += element.size;
      this.stride += element.size;
    }
  }
}

export enum ShaderDataType {
  Float,
  Float2,
  Float3,
  Float4,
  Int,
  Int2,
  Int3,
  Int4,
  Mat3,
  Mat4,
}

interface IBufferElement {
  name: string;
  type: ShaderDataType;
  normalized?: boolean;
}

export class VertexBufferElement {
  public type: ShaderDataType;
  public name: string;
  public normalized = false;
  public size: GLsizei;
  public offset: GLsizei;

  constructor(type: ShaderDataType, name: string, normalized = false) {
    this.type = type;
    this.name = name;
    this.normalized = normalized;
    this.size = shaderDataTypeSize(type);
    this.offset = 0;
  }

  public getComponentCount(): number {
    switch (this.type) {
      case ShaderDataType.Float:
        return 1;
      case ShaderDataType.Float2:
        return 2;
      case ShaderDataType.Float3:
        return 3;
      case ShaderDataType.Float4:
        return 4;
      case ShaderDataType.Mat3:
        return 3 * 3;
      case ShaderDataType.Mat4:
        return 4 * 4;
      case ShaderDataType.Int:
        return 1;
      case ShaderDataType.Int2:
        return 2;
      case ShaderDataType.Int3:
        return 3;
      case ShaderDataType.Int4:
        return 4;
    }
  }
}

function shaderDataTypeSize(dataType: ShaderDataType) {
  switch (dataType) {
    case ShaderDataType.Float:
      return 4;
    case ShaderDataType.Float2:
      return 4 * 2;
    case ShaderDataType.Float3:
      return 4 * 3;
    case ShaderDataType.Float4:
      return 4 * 4;

    case ShaderDataType.Int:
      return 4;
    case ShaderDataType.Int2:
      return 4 * 2;
    case ShaderDataType.Int3:
      return 4 * 3;
    case ShaderDataType.Int4:
      return 4 * 4;

    case ShaderDataType.Mat3:
      return 4 * 3 * 3;
    case ShaderDataType.Mat4:
      return 4 * 4 * 4;
  }
}
