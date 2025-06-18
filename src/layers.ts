import { Layer } from '@/core/layer';
import { assert } from '@/debug/asserts';
import { IndexBuffer } from '@/gfx/index-buffer';
import { Shader } from '@/gfx/shader';
import { VertexArray } from '@/gfx/vertex-array';
import { VertexBuffer } from '@/gfx/vertex-buffer';
import { ShaderDataType, VertexBufferLayout } from '@/gfx/vertex-buffer-layout';
import { DeltaTime } from '@/shared/types';

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
    const context = this.context;

    const vertexArray = new VertexArray(context);

    const indices = new Uint32Array([0, 1, 2, 0, 1, 3, 0, 3, 4, 0, 2, 4, 1, 2, 3, 3, 2, 4]);
    const vertices = new Float32Array([
      0.0, 0.5, 0.0, 1.0, 0.0, 0.0, 0.5, -0.5, 0.5, 0.0, 1.0, 0.0, -0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 0.5, -0.5, -0.5, 0.0,
      1.0, 0.0, -0.5, -0.5, -0.5, 0.0, 0.0, 1.0,
    ]);

    const indexBuffer = new IndexBuffer(context, indices);
    vertexArray.setIndexBuffer(indexBuffer);

    const vertexBuffer = new VertexBuffer(context, vertices);
    const bufferLayout = new VertexBufferLayout([
      { name: 'a_Position', type: ShaderDataType.Float3 },
      { name: 'a_Color', type: ShaderDataType.Float3 },
    ]);
    vertexBuffer.setBufferLayout(bufferLayout);
    vertexArray.addVertexBuffer(vertexBuffer);

    const shader = new Shader(context, 'test.glsl');

    context.enable(context.DEPTH_TEST);

    context.clearColor(0, 0, 0, 1);
    context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

    context.useProgram(shader.getProgram());

    const location = context.getUniformLocation(shader.getProgram(), 'u_Transform');
    context.uniformMatrix4fv(location, false, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

    context.drawElements(context.TRIANGLES, 18, context.UNSIGNED_INT, 0);
  }
}
