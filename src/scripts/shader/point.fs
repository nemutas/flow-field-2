#version 300 es
precision highp float;

out vec4 outColor;

in float vLife;

void main() {
  outColor = vec4(1, 1, 1, vLife * 0.5);
}