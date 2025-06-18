#type vertex
#version 300 es
in vec3 a_Position;
in vec3 a_Color;
uniform mat4 u_Transform;
out vec3 v_Color;
void main() {
  gl_Position = u_Transform * vec4(a_Position, 1.0f);
  v_Color = a_Color;
}

#type fragment
#version 300 es
precision highp float;
in vec3 v_Color;
out vec4 color;
void main() {
  color = vec4(v_Color, 1.0f);
}