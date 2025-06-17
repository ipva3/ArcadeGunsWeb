import { assert } from '@/debug/asserts';
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

export class GuiLayer extends Layer<'2d'> {
  constructor(containerId: string) {
    super('Gui', containerId, 0, 0, window.innerWidth, window.innerHeight, '2d');
  }

  public override attach(): void {
    this.view.show(this.containerId);
  }

  public override detach(): void {
    this.view.hide();
  }

  public override update(deltaTime: DeltaTime): void {
    this.context.reset();
    const gradient = this.context.createLinearGradient(0, 0, 200, 0);
    gradient.addColorStop(0, 'magenta');
    gradient.addColorStop(0.5, 'blue');
    gradient.addColorStop(1.0, 'red');
    this.context.fillStyle = gradient;
    // this.context.fillStyle = 'white';
    this.context.font = '25px Arial';
    this.context.fillText(`Delta: ${String(deltaTime.toFixed(2))}ms`, 50, 50);
    this.context.fillText(`FPS:   ${String((1000 / deltaTime).toFixed(0))}`, 50, 90);
    this.context.fill();
  }
}

export class WorldLayer extends Layer<'webgl2'> {
  constructor(containerId: string) {
    super('Game', containerId, 0, 0, window.innerWidth, window.innerHeight, 'webgl2');
  }

  public override attach(): void {
    this.view.show(this.containerId);
  }

  public override detach(): void {
    this.view.hide();
  }

  public override update(deltaTime: DeltaTime): void {
    const gl = this.context;

    const vertexArray = gl.createVertexArray();
    gl.bindVertexArray(vertexArray);

    const indices = new Uint32Array([0, 1, 2, 0, 1, 3, 0, 3, 4, 0, 2, 4, 1, 2, 3, 3, 2, 4]);
    const vertices = new Float32Array([
      0.0, 0.5, 0.0, 1.0, 0.0, 0.0, 0.5, -0.5, 0.5, 0.0, 1.0, 0.0, -0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 0.5, -0.5, -0.5, 0.0,
      1.0, 0.0, -0.5, -0.5, -0.5, 0.0, 0.0, 1.0,
    ]);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const bufferLayoutSchema = [
      { name: 'a_Position', size: 4 * 3, offset: 0 },
      { name: 'a_Color', size: 4 * 3, offset: 0 },
    ];
    let offset = 0;
    let stride = 0;
    for (const element of bufferLayoutSchema) {
      element.offset = offset;
      offset += element.size;
      stride += element.size;
    }

    for (let index = 0; index < bufferLayoutSchema.length; ++index) {
      const element = bufferLayoutSchema[index];
      gl.enableVertexAttribArray(index);
      gl.vertexAttribPointer(index, 3, gl.FLOAT, false, stride, element.offset);
    }

    const program = gl.createProgram();

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    assert(vertexShader, 'Can not create vertex shader!');

    const vertexShaderSource = `#version 300 es
in vec3 a_Position;
in vec3 a_Color;
uniform mat4 u_Transform;
out vec3 v_Color;
void main() {
  gl_Position = u_Transform * vec4(a_Position, 1.0f);
  v_Color = a_Color;
}`;

    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    let status = Boolean(gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS));
    assert(status, String(gl.getShaderInfoLog(vertexShader)));
    gl.attachShader(program, vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    assert(fragmentShader, 'Can not create fragment shader!');

    const fragmentShaderSource = `#version 300 es
precision highp float;
in vec3 v_Color;
out vec4 color;
void main() {
  color = vec4(v_Color, 1.0f);
}`;
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    status = Boolean(gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS));
    assert(status, String(gl.getShaderInfoLog(fragmentShader)));
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    status = Boolean(gl.getProgramParameter(program, gl.LINK_STATUS));
    assert(status, String(gl.getProgramInfoLog(program)));
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    gl.enable(gl.DEPTH_TEST);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);

    const location = gl.getUniformLocation(program, 'u_Transform');
    gl.uniformMatrix4fv(location, false, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

    gl.drawElements(gl.TRIANGLES, 18, gl.UNSIGNED_INT, 0);
  }
}
