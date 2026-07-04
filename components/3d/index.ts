/* ═══════════════════════════════════════════════════
   Hero 3D Scene — core exports
   Compose inside a single <Canvas>:

   <Canvas camera={{ position: [0, 4, 14], fov: 55 }}>
     <ambientLight intensity={0.25} />
     <pointLight position={[0, 0, 0]} intensity={2} color="#00FF88" />
     <Starfield count={2000} />
     <NeutronStar />
   </Canvas>
   ═══════════════════════════════════════════════════ */

export type { NeutronStarProps } from "./NeutronStar";
export { NeutronStar } from "./NeutronStar";
export { SpaceCanvas } from "./SpaceCanvas";
export type { StarfieldProps } from "./Starfield";
export { Starfield } from "./Starfield";
export { WebGLErrorBoundary } from "./WebGLErrorBoundary";
