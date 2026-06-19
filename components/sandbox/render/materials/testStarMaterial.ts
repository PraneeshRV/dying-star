import { Color } from "three";
import {
  Fn,
  mix,
  mx_noise_float,
  positionLocal,
  time,
  uniform,
  vec3,
} from "three/tsl";
import { MeshStandardNodeMaterial } from "three/webgpu";

/**
 * Options for {@link createTestStarMaterial}. All fields are optional and fall
 * back to sensible defaults that produce a warm, animated glowing star.
 */
export interface TestStarMaterialOptions {
  /** Hottest plasma color, used at noise peaks. Defaults to `"#fff2cc"`. */
  colorHot?: string;
  /** Coolest plasma color, used at noise troughs. Defaults to `"#ff7a45"`. */
  colorCool?: string;
  /** Spatial frequency of the surface noise. Defaults to `2.2`. */
  noiseScale?: number;
  /** Temporal pulse rate of the plasma animation. Defaults to `0.6`. */
  pulseSpeed?: number;
}

/**
 * Builds a TSL-authored {@link MeshStandardNodeMaterial} for the S0 "test star".
 *
 * The emissive surface is driven entirely by TSL nodes so the material compiles
 * to both WGSL (WebGPU) and GLSL (WebGL2) from one source. A multi-sample plasma
 * is built from {@link mx_noise_float} sampled in local space and offset by an
 * animated `time` term, then used to {@link mix} between the cool and hot colors.
 * The result is assigned to `emissiveNode` and amplified so the star reads as a
 * self-lit body without bloom.
 *
 * Animated scalars are wrapped in {@link uniform} nodes so nothing is
 * reallocated per frame; the material is intended to be created once and reused.
 *
 * @param opts - Optional color and animation tuning.
 * @returns A configured node material ready to attach to a mesh.
 */
export function createTestStarMaterial(
  opts?: TestStarMaterialOptions,
): MeshStandardNodeMaterial {
  const colorHotHex = opts?.colorHot ?? "#fff2cc";
  const colorCoolHex = opts?.colorCool ?? "#ff7a45";
  const noiseScale = opts?.noiseScale ?? 2.2;
  const pulseSpeed = opts?.pulseSpeed ?? 0.6;

  const hot = new Color(colorHotHex);
  const cool = new Color(colorCoolHex);

  const material = new MeshStandardNodeMaterial();
  material.roughness = 1;
  material.metalness = 0;

  // Uniforms: stable node references that won't be reallocated per frame.
  const uNoiseScale = uniform(noiseScale);
  const uPulseSpeed = uniform(pulseSpeed);
  const uHot = uniform(vec3(hot.r, hot.g, hot.b));
  const uCool = uniform(vec3(cool.r, cool.g, cool.b));

  const emissive = Fn(() => {
    // Animate the sample position so the plasma visibly evolves over time.
    const flow = time.mul(uPulseSpeed);
    const sampleA = positionLocal.mul(uNoiseScale).add(vec3(flow));
    const sampleB = positionLocal
      .mul(uNoiseScale.mul(2.1))
      .sub(vec3(flow.mul(0.7)));

    // Two octaves of noise remapped from [-1, 1] to [0, 1] and blended.
    const n1 = mx_noise_float(sampleA).mul(0.5).add(0.5);
    const n2 = mx_noise_float(sampleB).mul(0.5).add(0.5);
    const plasma = mix(n1, n2, 0.5);

    // Mix cool -> hot by the plasma value and amplify to read without bloom.
    return mix(uCool, uHot, plasma).mul(1.6);
  })();

  material.emissiveNode = emissive;
  // Keep the lit base dark so the emissive plasma dominates the read.
  material.colorNode = vec3(0.02, 0.01, 0.0);

  return material;
}
