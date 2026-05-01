export const ATMOSPHERE_VERTEX_SHADER = /* glsl */ `
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

// Single-pass Rayleigh and Mie inspired limb glow. This is intentionally lighter
// than a physically complete ray-marched atmosphere so the hero keeps its frame
// budget on tier-2 GPUs.
export const ATMOSPHERE_FRAGMENT_SHADER = /* glsl */ `
uniform vec3 atmosphereColor;
uniform vec3 sunPosition;
uniform float opacity;
uniform float rayleigh;
uniform float mie;
uniform float falloff;

varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main() {
  vec3 normal = normalize(vWorldNormal);
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  vec3 sunDir = normalize(sunPosition - vWorldPosition);

  float viewFacing = clamp(dot(viewDir, normal), 0.0, 1.0);
  float limb = pow(1.0 - viewFacing, falloff);
  float sunFacing = dot(normal, sunDir) * 0.5 + 0.5;
  float rayleighScatter = pow(1.0 - sunFacing, 1.35) * rayleigh;
  float mieForward = pow(max(sunFacing, 0.0), 2.0) * mie;
  float alpha = clamp((limb * (0.55 + rayleighScatter)) + (limb * mieForward), 0.0, 1.0) * opacity;
  vec3 color = atmosphereColor * (0.85 + rayleighScatter * 0.45 + mieForward * 0.35);

  gl_FragColor = vec4(color, alpha);
}
`;

export const NIGHT_LIGHTS_VERTEX_SHADER = /* glsl */ `
varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main() {
  vUv = uv;
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

export const NIGHT_LIGHTS_FRAGMENT_SHADER = /* glsl */ `
uniform sampler2D nightTexture;
uniform vec3 sunPosition;
uniform float opacity;

varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main() {
  vec3 normal = normalize(vWorldNormal);
  vec3 sunDir = normalize(sunPosition - vWorldPosition);
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  vec3 city = texture2D(nightTexture, vUv).rgb;
  float luminance = dot(city, vec3(0.2126, 0.7152, 0.0722));
  float darkSide = 1.0 - smoothstep(-0.18, 0.12, dot(normal, sunDir));
  float frontFacing = smoothstep(-0.12, 0.18, dot(normal, viewDir));
  float alpha = luminance * darkSide * frontFacing * opacity;

  gl_FragColor = vec4(city, alpha);
}
`;
