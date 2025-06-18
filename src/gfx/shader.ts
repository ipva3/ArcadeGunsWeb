import { assert, assertCondition } from '@/debug/asserts';
import { NonEmptyString } from '@/shared/types';
import { isNil } from '@/shared/utils';

import { Context } from './base-buffer';
import { ShaderLibrary } from './shader-library';

type ShaderType = 'vertex' | 'fragment';

export class Shader {
  private context: Context;
  private program: WebGLProgram;
  private shaderSources: Map<ShaderType, WebGLShader> = new Map();

  constructor(context: Context, filepath: NonEmptyString);
  constructor(context: Context, vertexSource: NonEmptyString, fragmentSource: NonEmptyString);
  constructor(context: Context, filepathOrSource: NonEmptyString, fragmentSource?: NonEmptyString) {
    this.context = context;

    this.program = context.createProgram();
    if (!isNil(fragmentSource)) {
      this.preProcess(filepathOrSource, fragmentSource);
      return;
    }
    const [vSource, fSource] = this.getSourceFromFile(filepathOrSource);
    this.preProcess(vSource, fSource);
  }

  public getProgram(): WebGLProgram {
    return this.program;
  }

  private getSourceFromFile(filepath: NonEmptyString) {
    const shaderSource = ShaderLibrary.Get(`/shaders/${filepath}`);
    assertCondition<string>(shaderSource, !isNil(shaderSource), `Shader with name '${filepath}' not found!`);

    let currentType: ShaderType | undefined;
    let vSource = '';
    let fSource = '';

    for (const line of shaderSource.split('\n')) {
      if (!line.length) continue;
      if (line.startsWith('#type')) {
        const type = line.split(' ')[1];
        assertCondition<ShaderType>(type, type === 'vertex' || type === 'fragment', 'Unknown shader type!');
        currentType = type;
        continue;
      }
      assert(currentType, `Unrecognized shader source line '${line}'`);
      switch (currentType) {
        case 'vertex': {
          vSource += `${line}\n`;
          break;
        }
        case 'fragment': {
          fSource += `${line}\n`;
          break;
        }
      }
    }

    return [vSource, fSource] as const;
  }

  public bind(): void {
    this.context.useProgram(this.program);
  }

  public unbind(): void {
    this.context.useProgram(null);
  }

  private preProcess(vertex: string, fragment: string) {
    this.compile('vertex', vertex);
    this.compile('fragment', fragment);
    this.context.linkProgram(this.program);
    this.bind();
    for (const shader of this.shaderSources.values()) {
      this.context.deleteShader(shader);
    }
  }

  private compile(type: ShaderType, shaderSource: string) {
    const shader = this.context.createShader(this.glTypeFromString(type));
    assert(shader, 'Can not create shader!');
    this.context.shaderSource(shader, shaderSource);
    this.context.compileShader(shader);
    const status = Boolean(this.context.getShaderParameter(shader, this.context.COMPILE_STATUS));
    assert(status, String(this.context.getShaderInfoLog(shader)));
    this.context.attachShader(this.program, shader);
    this.shaderSources.set(type, shader);
  }

  private glTypeFromString(type: ShaderType): GLenum {
    if (type === 'vertex') {
      return this.context.VERTEX_SHADER;
    }
    return this.context.FRAGMENT_SHADER;
  }
}
