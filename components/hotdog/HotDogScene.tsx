"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import { HotDog } from "./HotDog";
import * as THREE from "three";

/**
 * The stage.
 *
 * The environment is built out of Lightformers rather than loaded as an HDR.
 * drei's presets fetch a few megabytes from a third-party CDN, and the one
 * object this whole page is about should not be waiting on someone else's
 * uptime to know what colour it is. Three emitters — a warm key overhead, a
 * red bounce from the left, a cool rim from the right — give the sauces
 * something to reflect and cost nothing.
 */
export default function HotDogScene({ bell = 0, className }: { bell?: number; className?: string }) {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  return (
    <div className={className}>
      <Canvas
        shadows
        // Capped at 2: a 3x retina panel triples the fragment count for a
        // difference nobody can see on a mesh this smooth.
        dpr={[1, 2]}
        camera={{ position: [0, 0.78, 5.4], fov: 30 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.35} />
          <directionalLight
            position={[3.2, 5, 2.4]}
            intensity={2.6}
            color="#fff2d8"
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0004}
          />
          <directionalLight position={[-4, 1.5, -2]} intensity={0.9} color="#ff5a6a" />
          <pointLight position={[0, -1.6, 1.4]} intensity={2.2} color="#ffb35c" distance={6} />

          <Environment resolution={256}>
            <Lightformer intensity={3.2} position={[0, 3.4, 2]} scale={[7, 5, 1]} color="#fff4de" />
            <Lightformer intensity={1.8} position={[-4.5, 1, -1.5]} scale={[4, 4, 1]} color="#ff5f4a" />
            <Lightformer intensity={1.4} position={[4.5, 0.4, -2.5]} scale={[4, 4, 1]} color="#63a7ff" />
            <Lightformer intensity={1.1} position={[0, -3, 1]} scale={[6, 3, 1]} color="#ffcf8a" />
          </Environment>

          <group position={[0, -0.12, 0]}>
            <Fit>
              <HotDog bell={bell} spin={!reduced} />
            </Fit>
            <ContactShadows
              position={[0, -0.78, 0]}
              opacity={0.55}
              scale={6}
              blur={2.6}
              far={2.2}
              resolution={512}
              color="#2a0a0e"
            />
          </group>

          <OrbitControls
            makeDefault
            enableZoom={false}
            enablePan={false}
            // Let people turn it over, but never let them get under the floor
            // or look straight down the barrel — both look broken.
            minPolarAngle={Math.PI / 3.4}
            maxPolarAngle={Math.PI / 1.85}
            rotateSpeed={0.5}
            dampingFactor={0.08}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

/**
 * Keep the whole hot dog inside the frame on any canvas shape.
 *
 * It is nearly three units long and barely one tall, so a narrow canvas — a
 * phone, or the hero on a laptop in portrait — crops the ends off long before
 * it runs out of vertical room. Scaling by the aspect ratio is cheaper and
 * steadier than moving the camera, which would also change the perspective and
 * with it how fat the bun looks.
 */
function Fit({ children }: { children: React.ReactNode }) {
  const size = useThree((s) => s.size);
  const aspect = size.width / Math.max(1, size.height);
  const scale = THREE.MathUtils.clamp(aspect / 2.1, 0.52, 1);
  return <group scale={scale}>{children}</group>;
}
