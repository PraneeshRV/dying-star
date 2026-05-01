"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  ATMOSPHERE_FRAGMENT_SHADER,
  ATMOSPHERE_VERTEX_SHADER,
  NIGHT_LIGHTS_FRAGMENT_SHADER,
  NIGHT_LIGHTS_VERTEX_SHADER,
} from "@/shaders/planetAtmosphere";
import type { PlanetConfig, PlanetRealismProfile } from "./shatteredSystem";

const STAR_LIGHT_POSITION = new THREE.Vector3(0, 0, 0);
const LOW_TIER_TEXTURE_SIZE = 512;
const HIGH_TIER_TEXTURE_SIZE = 1024;

interface PlanetSurfaceLayerProps {
  hovered: boolean;
  planet: PlanetConfig;
  speedMultiplier: number;
  tier: number;
}

interface ProceduralTextureSet {
  cloud: THREE.DataTexture | null;
  diffuse: THREE.DataTexture;
  night: THREE.DataTexture | null;
  normal: THREE.DataTexture;
  roughness: THREE.DataTexture;
}

interface PixelSample {
  cloudAlpha: number;
  diffuse: [number, number, number];
  height: number;
  night: [number, number, number];
  roughness: number;
}

export function PlanetSurfaceLayer({
  hovered,
  planet,
  speedMultiplier,
  tier,
}: PlanetSurfaceLayerProps) {
  const realism = planet.realism;
  const segmentCount = realism ? (tier <= 1 ? 40 : 72) : 24;
  const ringCount = realism ? (tier <= 1 ? 24 : 44) : 18;

  if (!realism) {
    return (
      <mesh>
        <sphereGeometry args={[planet.size, segmentCount, ringCount]} />
        <meshStandardMaterial
          color={planet.color}
          emissive={planet.emissive}
          emissiveIntensity={hovered ? 0.82 : 0.42}
          metalness={0.72}
          roughness={0.46}
        />
      </mesh>
    );
  }

  return (
    <>
      <RealisticPlanetSurface
        hovered={hovered}
        planet={planet}
        speedMultiplier={speedMultiplier}
        tier={tier}
      />
      {realism.atmosphere ? (
        <AtmosphereShell planet={planet} tier={tier} />
      ) : null}
    </>
  );
}

function RealisticPlanetSurface({
  hovered,
  planet,
  speedMultiplier,
  tier,
}: PlanetSurfaceLayerProps) {
  const realism = planet.realism;
  const textureSize =
    tier <= 1 ? LOW_TIER_TEXTURE_SIZE : HIGH_TIER_TEXTURE_SIZE;
  const textures = useProceduralPlanetTextures(realism?.profile, textureSize);
  const segmentCount = tier <= 1 ? 48 : 96;
  const ringCount = tier <= 1 ? 28 : 56;

  if (!realism || !textures) {
    return null;
  }

  return (
    <>
      <mesh>
        <sphereGeometry args={[planet.size, segmentCount, ringCount]} />
        <meshStandardMaterial
          color={planet.color}
          emissive={planet.emissive}
          emissiveIntensity={hovered ? 0.18 : 0.04}
          map={textures.diffuse}
          metalness={realism.profile === "earth" ? 0.06 : 0.02}
          normalMap={textures.normal}
          normalScale={
            realism.profile === "earth"
              ? new THREE.Vector2(0.62, 0.62)
              : new THREE.Vector2(0.9, 0.9)
          }
          roughnessMap={textures.roughness}
          roughness={realism.profile === "earth" ? 0.72 : 0.88}
        />
      </mesh>

      {textures.night ? (
        <NightSideLights planet={planet} texture={textures.night} tier={tier} />
      ) : null}

      {textures.cloud ? (
        <PlanetCloudLayer
          planet={planet}
          speedMultiplier={speedMultiplier}
          texture={textures.cloud}
          tier={tier}
        />
      ) : null}
    </>
  );
}

function AtmosphereShell({
  planet,
  tier,
}: {
  planet: PlanetConfig;
  tier: number;
}) {
  const atmosphere = planet.realism?.atmosphere;
  const uniforms = useMemo(
    () => ({
      atmosphereColor: {
        value: new THREE.Color(atmosphere?.color ?? planet.emissive),
      },
      falloff: { value: atmosphere?.falloff ?? 2.8 },
      mie: { value: atmosphere?.mie ?? 0.16 },
      opacity: { value: tier <= 1 ? 0.18 : (atmosphere?.opacity ?? 0.34) },
      rayleigh: { value: atmosphere?.rayleigh ?? 0.8 },
      sunPosition: { value: STAR_LIGHT_POSITION },
    }),
    [atmosphere, planet.emissive, tier],
  );

  if (!atmosphere) {
    return null;
  }

  return (
    <mesh scale={atmosphere.shellScale}>
      <sphereGeometry
        args={[planet.size, tier <= 1 ? 40 : 72, tier <= 1 ? 24 : 44]}
      />
      <shaderMaterial
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        fragmentShader={ATMOSPHERE_FRAGMENT_SHADER}
        side={THREE.BackSide}
        transparent
        uniforms={uniforms}
        vertexShader={ATMOSPHERE_VERTEX_SHADER}
      />
    </mesh>
  );
}

function NightSideLights({
  planet,
  tier,
  texture,
}: {
  planet: PlanetConfig;
  tier: number;
  texture: THREE.DataTexture;
}) {
  const uniforms = useMemo(
    () => ({
      nightTexture: { value: texture },
      opacity: { value: 0.92 },
      sunPosition: { value: STAR_LIGHT_POSITION },
    }),
    [texture],
  );

  return (
    <mesh scale={1.003}>
      <sphereGeometry
        args={[planet.size, tier <= 1 ? 36 : 72, tier <= 1 ? 20 : 42]}
      />
      <shaderMaterial
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        fragmentShader={NIGHT_LIGHTS_FRAGMENT_SHADER}
        transparent
        uniforms={uniforms}
        vertexShader={NIGHT_LIGHTS_VERTEX_SHADER}
      />
    </mesh>
  );
}

function PlanetCloudLayer({
  planet,
  speedMultiplier,
  texture,
  tier,
}: {
  planet: PlanetConfig;
  speedMultiplier: number;
  texture: THREE.DataTexture;
  tier: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.045 * speedMultiplier;
  });

  return (
    <mesh ref={meshRef} scale={1.014}>
      <sphereGeometry
        args={[planet.size, tier <= 1 ? 40 : 72, tier <= 1 ? 24 : 44]}
      />
      <meshPhongMaterial
        alphaMap={texture}
        color="#f7fbff"
        depthWrite={false}
        map={texture}
        opacity={0.36}
        transparent
      />
    </mesh>
  );
}

function useProceduralPlanetTextures(
  profile: PlanetRealismProfile | undefined,
  size: number,
) {
  const textures = useMemo(() => {
    if (!profile) {
      return null;
    }

    return buildProceduralTextureSet(profile, size);
  }, [profile, size]);

  useEffect(() => {
    return () => {
      if (!textures) return;
      textures.diffuse.dispose();
      textures.normal.dispose();
      textures.roughness.dispose();
      textures.night?.dispose();
      textures.cloud?.dispose();
    };
  }, [textures]);

  return textures;
}

function buildProceduralTextureSet(
  profile: PlanetRealismProfile,
  width: number,
): ProceduralTextureSet {
  const height = width / 2;
  const diffuse = new Uint8Array(width * height * 4);
  const normal = new Uint8Array(width * height * 4);
  const roughness = new Uint8Array(width * height * 4);
  const night = profile === "earth" ? new Uint8Array(width * height * 4) : null;
  const cloud = profile === "earth" ? new Uint8Array(width * height * 4) : null;
  const heights = new Float32Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const u = x / width;
      const v = y / height;
      const index = (y * width + x) * 4;
      const sample =
        profile === "earth" ? sampleEarthPixel(u, v) : sampleMarsPixel(u, v);

      writeRgb(diffuse, index, sample.diffuse, 255);
      writeGreyscale(roughness, index, sample.roughness);
      heights[y * width + x] = sample.height;

      if (night) {
        writeRgb(night, index, sample.night, 255);
      }

      if (cloud) {
        writeRgb(
          cloud,
          index,
          [245, 250, 255],
          Math.round(clamp(sample.cloudAlpha, 0, 1) * 255),
        );
      }
    }
  }

  writeNormalMap(normal, heights, width, height, profile);

  return {
    cloud: cloud ? createDataTexture(cloud, width, height, true) : null,
    diffuse: createDataTexture(diffuse, width, height, true),
    night: night ? createDataTexture(night, width, height, true) : null,
    normal: createDataTexture(normal, width, height, false),
    roughness: createDataTexture(roughness, width, height, false),
  };
}

function sampleEarthPixel(u: number, v: number): PixelSample {
  const latitude = (0.5 - v) * Math.PI;
  const longitude = (u - 0.5) * Math.PI * 2;
  const polar = Math.abs(Math.sin(latitude)) ** 5;
  const continental =
    fbm(u * 3.4 + 0.13, v * 1.8 - 0.22, 5, 11) * 0.62 +
    Math.sin(longitude * 2.1 + Math.sin(latitude * 3.2)) * 0.16 +
    Math.cos(longitude * 3.8 - latitude * 1.4) * 0.08;
  const land = smoothstep(0.51, 0.59, continental - polar * 0.08);
  const coast = 1 - Math.abs(land * 2 - 1);
  const mountainNoise = fbm(u * 16.0, v * 8.0, 4, 31);
  const mountain = smoothstep(0.64, 0.9, mountainNoise + land * 0.26);
  const desert = smoothstep(
    0.38,
    0.72,
    fbm(u * 7.2 + 2.4, v * 3.1, 4, 47) + Math.cos(latitude * 3.0) * 0.12,
  );
  const oceanDepth = fbm(u * 8.0, v * 4.2, 4, 7);
  const oceanColor = mixColor(
    [5, 19, 50],
    [17, 88, 128],
    clamp(oceanDepth * 0.42 + coast * 0.58, 0, 1),
  );
  const vegetation = mixColor([34, 102, 66], [72, 124, 60], mountainNoise);
  const arid = mixColor([157, 121, 70], [196, 155, 84], desert);
  const landColor = mixColor(vegetation, arid, desert * 0.68);
  const highlands = mixColor(landColor, [184, 176, 152], mountain * 0.55);
  const snow = smoothstep(0.56, 0.88, polar + mountain * 0.24);
  const diffuse = mixColor(
    mixColor(oceanColor, highlands, land),
    [224, 235, 238],
    snow,
  );
  const cityNoise =
    fbm(u * 56.0 + 5.0, v * 22.0, 3, 88) * fbm(u * 19.0, v * 11.0 + 1.7, 3, 83);
  const cityMask =
    land *
    (1 - polar) *
    smoothstep(0.44, 0.72, cityNoise + coast * 0.25 + desert * 0.08);
  const night: [number, number, number] = [
    cityMask * 255,
    cityMask * 182,
    cityMask * 82,
  ];
  const cloudBands =
    fbm(u * 10.0 + Math.sin(latitude * 3.0) * 0.12, v * 5.2, 5, 101) *
    (0.75 + Math.cos(latitude * 4.0) * 0.18);
  const stormCells = fbm(u * 28.0, v * 14.0 + 0.4, 3, 109);
  const cloudAlpha =
    smoothstep(0.54, 0.78, cloudBands) * 0.65 +
    smoothstep(0.72, 0.9, stormCells) * 0.28;

  return {
    cloudAlpha: cloudAlpha * (1 - polar * 0.25),
    diffuse,
    height:
      0.2 + land * (0.36 + mountain * 0.3) - (1 - land) * oceanDepth * 0.08,
    night,
    roughness: (1 - land) * 0.22 + land * (0.68 + mountain * 0.18),
  };
}

function sampleMarsPixel(u: number, v: number): PixelSample {
  const latitude = (0.5 - v) * Math.PI;
  const ridge = fbm(u * 7.0 + 0.7, v * 3.2, 5, 201);
  const dust = fbm(u * 18.0, v * 8.5 + 1.3, 4, 227);
  const basalt = fbm(u * 4.0 - 1.2, v * 2.3, 4, 239);
  const crater = craterField(u, v);
  const polar = smoothstep(0.78, 0.96, Math.abs(Math.sin(latitude)));
  const valley = smoothstep(
    0.47,
    0.68,
    ridge + Math.sin(u * Math.PI * 8) * 0.08,
  );
  const base = mixColor([105, 45, 29], [178, 88, 48], dust);
  const iron = mixColor(base, [210, 132, 76], ridge * 0.55);
  const dark = mixColor(iron, [69, 50, 45], basalt * 0.42 + crater * 0.2);
  const diffuse = mixColor(dark, [220, 206, 176], polar * 0.72);

  return {
    cloudAlpha: 0,
    diffuse,
    height: 0.31 + ridge * 0.28 + valley * 0.1 - crater * 0.18 + polar * 0.07,
    night: [0, 0, 0],
    roughness: 0.72 + dust * 0.18 + crater * 0.08,
  };
}

function writeNormalMap(
  target: Uint8Array,
  heights: Float32Array,
  width: number,
  height: number,
  profile: PlanetRealismProfile,
) {
  const strength = profile === "earth" ? 7.2 : 9.6;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const left = heights[y * width + ((x - 1 + width) % width)];
      const right = heights[y * width + ((x + 1) % width)];
      const up = heights[Math.max(0, y - 1) * width + x];
      const down = heights[Math.min(height - 1, y + 1) * width + x];
      const dx = (right - left) * strength;
      const dy = (down - up) * strength;
      const len = Math.hypot(dx, dy, 1) || 1;
      const index = (y * width + x) * 4;

      target[index] = Math.round((-dx / len) * 127 + 128);
      target[index + 1] = Math.round((-dy / len) * 127 + 128);
      target[index + 2] = Math.round((1 / len) * 127 + 128);
      target[index + 3] = 255;
    }
  }
}

function createDataTexture(
  data: Uint8Array,
  width: number,
  height: number,
  srgb: boolean,
) {
  const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
  texture.anisotropy = 4;
  texture.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  texture.generateMipmaps = true;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

function writeRgb(
  target: Uint8Array,
  index: number,
  color: [number, number, number],
  alpha: number,
) {
  target[index] = Math.round(clamp(color[0], 0, 255));
  target[index + 1] = Math.round(clamp(color[1], 0, 255));
  target[index + 2] = Math.round(clamp(color[2], 0, 255));
  target[index + 3] = alpha;
}

function writeGreyscale(target: Uint8Array, index: number, value: number) {
  const channel = Math.round(clamp(value, 0, 1) * 255);
  target[index] = channel;
  target[index + 1] = channel;
  target[index + 2] = channel;
  target[index + 3] = 255;
}

function craterField(u: number, v: number) {
  let amount = 0;

  for (let index = 0; index < 20; index++) {
    const cx = hash(index * 17.1, 0.42, 909);
    const cy = hash(index * 5.7, 0.88, 411) * 0.82 + 0.08;
    const radius = 0.012 + hash(index * 2.1, 4.7, 137) * 0.045;
    const dx = Math.abs(u - cx);
    const wrappedX = Math.min(dx, 1 - dx);
    const dy = (v - cy) * 1.9;
    const dist = Math.hypot(wrappedX, dy);
    const rim = smoothstep(radius, radius * 0.62, dist);
    const bowl = smoothstep(radius * 0.64, radius * 0.2, dist);
    amount += Math.max(0, rim - bowl * 0.45) * 0.16 + bowl * 0.08;
  }

  return clamp(amount, 0, 1);
}

function fbm(x: number, y: number, octaves: number, seed: number) {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let norm = 0;

  for (let octave = 0; octave < octaves; octave++) {
    value +=
      smoothNoise(x * frequency, y * frequency, seed + octave * 19) * amplitude;
    norm += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return norm > 0 ? value / norm : 0;
}

function smoothNoise(x: number, y: number, seed: number) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const tx = smootherstep(x - x0);
  const ty = smootherstep(y - y0);
  const a = hash(x0, y0, seed);
  const b = hash(x0 + 1, y0, seed);
  const c = hash(x0, y0 + 1, seed);
  const d = hash(x0 + 1, y0 + 1, seed);

  return lerp(lerp(a, b, tx), lerp(c, d, tx), ty);
}

function hash(x: number, y: number, seed: number) {
  const value = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
  return value - Math.floor(value);
}

function mixColor(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] {
  const amount = clamp(t, 0, 1);
  return [
    lerp(a[0], b[0], amount),
    lerp(a[1], b[1], amount),
    lerp(a[2], b[2], amount),
  ];
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function smootherstep(value: number) {
  const t = clamp(value, 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
