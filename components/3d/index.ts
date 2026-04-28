/* ═══════════════════════════════════════════════════
   3D Scene — barrel exports
   Compose freely inside a single <Canvas>:

   <Canvas camera={{ position: [0, 4, 14], fov: 55 }}>
     <ambientLight intensity={0.25} />
     <pointLight position={[0, 0, 0]} intensity={2} color="#00FF88" />
     <Starfield count={2000} />
     <Constellation count={500} />
     <DysonSphere />
     <OrbitalPlanets />
     <NeutronStar />
   </Canvas>
   ═══════════════════════════════════════════════════ */

export type { ConstellationProps } from "./Constellation";
export { Constellation } from "./Constellation";
export type { DysonSphereProps } from "./DysonSphere";
export { DysonSphere } from "./DysonSphere";
export type { NeutronStarProps } from "./NeutronStar";
export { NeutronStar } from "./NeutronStar";
export type { OrbitalPlanetsProps } from "./OrbitalPlanets";
export { OrbitalPlanets } from "./OrbitalPlanets";
export { SpaceCanvas } from "./SpaceCanvas";
export type { StarfieldProps } from "./Starfield";
export { Starfield } from "./Starfield";
export { SystemCamera } from "./SystemCamera";
export { WebGLErrorBoundary } from "./WebGLErrorBoundary";
