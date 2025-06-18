import { assertCondition } from '@/debug/asserts';

export class ShaderLibrary {
  private static isLoaded = false;
  private static shaderMap: Map<string, string> = new Map();

  public static Get(name: string): string | undefined {
    if (!this.isLoaded) this.Load();
    return this.shaderMap.get(`/public${name}`);
  }

  private static Load(): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const shaders: Record<string, string> = import.meta.glob<string>('/public/shaders/**/*.glsl', {
      query: '?raw',
      import: 'default',
      eager: true,
    }) as Record<string, string>;

    for (const shaderPath in shaders) {
      const source = shaders[shaderPath];
      assertCondition<string>(source, typeof source === 'string', 'Shader must be string!');
      this.shaderMap.set(shaderPath, source);
    }
    this.isLoaded = true;
  }

  private constructor() {}
}
