#version 300 es
precision highp float;

uniform sampler2D tBackBuffer;
uniform float uTime;
uniform float uDeltaTime;
uniform int uFrame;
uniform vec2 uResolution;

in vec2 vUv;
out vec4 outColor;

const float PI = acos(-1.0);

#include './modules/noise.glsl'

vec3 hash(vec3 v) {
  uvec3 x = floatBitsToUint(v + vec3(.1, .2, .3));
  x = (x >> 8 ^ x.yzx) * 0x456789ABu;
  x = (x >> 8 ^ x.yzx) * 0x6789AB45u;
  x = (x >> 8 ^ x.yzx) * 0x89AB4567u;
  return vec3(x) / vec3(-1u);
}

mat2 rot(float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, s, -s, c);
}

void main() {
  vec4 b = texture(tBackBuffer, vUv);
  vec2 asp = uResolution / min(uResolution.x, uResolution.y);

  vec2 p;
  if (uFrame == 1) {
    p = hash(vec3(vUv, 0.1)).xy * 2.0 - 1.0;
    p *= asp;
    outColor = vec4(p, 0.0, 0.0);
    return;
  }

  float angle = cnoise(b.xy * 2.0) * 2.0 - 1.0;
  vec2 d = normalize(b.xy + vec2(1, 0) - b.xy) * rot(angle * PI + uTime * 0.3);

  p = b.xy + d * uDeltaTime * 0.2;
  float life = min(b.z + uDeltaTime * 0.3, 1.0);

  vec3 h = hash(vec3(vUv, uTime));
  if (h.z < 0.03) {
    p = h.xy * 2.0 - 1.0;
    p *= asp;
    life = 0.0;
  }

  vec2 n = normalize(vUv * 2.0 - 1.0);
  p = mix(p, n, 0.0015);

  outColor = vec4(p, life, 0.0);
}