export const GAS_GIANT_VERTEX_SHADER = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

export const GAS_GIANT_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform vec3 baseColor;
  uniform vec3 emissiveColor;
  uniform float hoverBoost;
  uniform vec3 sunPosition;
  uniform float uTime;

  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec2 vUv;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise2(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 5; i++) {
      value += noise2(p) * amplitude;
      p = p * 2.03 + vec2(11.7, 4.3);
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(sunPosition - vWorldPosition);
    float sun = max(dot(normal, lightDir), 0.0);
    float latitude = vUv.y - 0.5;
    float drift = uTime * 0.018;
    float shear = fbm(vec2(vUv.x * 9.0 + latitude * 3.0 - drift, vUv.y * 18.0));
    float fine = fbm(vec2(vUv.x * 34.0 - drift * 4.0, vUv.y * 52.0 + shear));
    float bands = sin(latitude * 82.0 + shear * 6.2 + fine * 1.7);
    float storm = smoothstep(
      0.17,
      0.0,
      length(vec2(fract(vUv.x - 0.68) - 0.5, (vUv.y - 0.43) * 2.3))
    );

    vec3 coldBand = mix(baseColor * 0.72, vec3(0.48, 0.68, 0.88), fine);
    vec3 warmBand = mix(vec3(0.68, 0.49, 0.31), vec3(0.94, 0.78, 0.48), shear);
    vec3 color = mix(coldBand, warmBand, bands * 0.5 + 0.5);
    color = mix(color, vec3(1.0, 0.78, 0.48), storm * 0.75);

    float terminator = smoothstep(-0.12, 0.38, sun);
    vec3 nightRim = emissiveColor * pow(1.0 - max(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0), 3.0);
    color *= 0.12 + terminator * 0.95;
    color += nightRim * (0.08 + hoverBoost * 0.12);

    gl_FragColor = vec4(color, 1.0);
  }
`;
