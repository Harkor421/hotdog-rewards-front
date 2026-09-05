"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildTextures } from "./textures";

/**
 * The hot dog itself.
 *
 * Every piece is generated in code — there is no .glb to load, nothing to
 * fetch, and nothing that can arrive late and pop in. The bun is one extruded
 * cross-section rather than two half-loaves stuck together, so the groove the
 * sausage sits in is genuinely part of the same surface and catches light the
 * way a slit in bread does.
 */

/** The bun, as a cross-section extruded down its length. */
function useBunGeometry() {
  return useMemo(() => {
    const s = new THREE.Shape();
    // Read this as a slice through the bun, looking down the sausage.
    // Outside first: down the left flank, around the bottom, up the right.
    s.moveTo(-0.55, 0.12);
    s.bezierCurveTo(-0.64, -0.24, -0.4, -0.5, 0, -0.5);
    s.bezierCurveTo(0.4, -0.5, 0.64, -0.24, 0.55, 0.12);
    // then over the right lip, down into the groove, and up the left lip
    s.bezierCurveTo(0.53, 0.26, 0.4, 0.3, 0.32, 0.15);
    s.bezierCurveTo(0.23, -0.02, -0.23, -0.02, -0.32, 0.18);
    s.bezierCurveTo(-0.4, 0.3, -0.53, 0.26, -0.55, 0.12);

    const DEPTH = 2.34;
    const g = new THREE.ExtrudeGeometry(s, {
      depth: DEPTH,
      curveSegments: 30,
      steps: 2,
      bevelEnabled: true,
      // A big, heavily segmented bevel is what rounds the two ends off. Bread
      // has no sharp edges anywhere, and a crisp rim is the single thing that
      // makes a generated loaf read as a machined part.
      bevelThickness: 0.16,
      bevelSize: 0.16,
      bevelOffset: 0,
      bevelSegments: 10,
    });
    // Centre it along the LENGTH only.
    //
    // geometry.center() would also recentre Y, and Y is not free here: the
    // shape was drawn so that the lips of the groove sit just below the top of
    // the sausage. Recentring the bounding box lifted the bun ~0.12 and the
    // bread closed over the sausage — a bap, not a hot dog.
    g.translate(0, 0, -DEPTH / 2);
    g.computeVertexNormals();
    return g;
  }, []);
}

/** A sauce zigzag, laid on the surface of the sausage rather than through it. */
function useSauceGeometry(radius: number, centerY: number, phase: number, amplitude: number, waves: number) {
  return useMemo(() => {
    const rr = radius + 0.045; // ride just proud of the casing
    const pts: THREE.Vector3[] = [];
    const N = 260;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      // The zigzag is an angle swept around the sausage, not a sideways offset
      // in x — so the ribbon stays welded to the curved surface instead of
      // sinking into it at the crests.
      const theta = amplitude * Math.sin(t * Math.PI * waves + phase);
      pts.push(new THREE.Vector3(rr * Math.sin(theta), centerY + rr * Math.cos(theta), THREE.MathUtils.lerp(-1.16, 1.16, t)));
    }
    const curve = new THREE.CatmullRomCurve3(pts, false, "centripetal", 0.5);
    return new THREE.TubeGeometry(curve, 320, 0.034, 10, false);
  }, [radius, centerY, phase, amplitude, waves]);
}

export function HotDog({ bell = 0, spin = true }: { bell?: number; spin?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const tex = useMemo(() => buildTextures(512), []);
  useEffect(() => () => tex.dispose(), [tex]);

  const bun = useBunGeometry();
  const SAUSAGE_R = 0.245;
  const SAUSAGE_Y = 0.21;
  const mustard = useSauceGeometry(SAUSAGE_R, SAUSAGE_Y, 0, 0.72, 8);
  const ketchup = useSauceGeometry(SAUSAGE_R, SAUSAGE_Y, Math.PI, 0.62, 8);

  // The bell: a short pop when a round is served, decaying back to rest.
  const pop = useRef(0);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return; // don't fire on mount
    }
    pop.current = 1;
  }, [bell]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    if (spin) g.rotation.y += delta * 0.28;
    pop.current = Math.max(0, pop.current - delta * 1.6);
    // ease-out on the way back down, so the pop lands hard and settles soft
    const e = pop.current * pop.current;
    const s = 1 + e * 0.09;
    g.scale.setScalar(s);
    g.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.035 + e * 0.12;
    g.rotation.z = Math.sin(state.clock.elapsedTime * 0.7) * 0.02 - e * 0.06;
  });

  return (
    <group ref={group} rotation={[0.06, -0.5, 0]}>
      {/* bun */}
      <mesh geometry={bun} castShadow receiveShadow>
        <meshStandardMaterial
          map={tex.bunColor}
          bumpMap={tex.bunBump}
          bumpScale={0.028}
          roughnessMap={tex.bunRough}
          roughness={1}
          metalness={0}
          color="#ffe4c2"
        />
      </mesh>

      {/* sausage — longer than the bun, the way they always are */}
      <mesh position={[0, SAUSAGE_Y, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <capsuleGeometry args={[SAUSAGE_R, 2.28, 14, 44]} />
        <meshPhysicalMaterial
          map={tex.dogColor}
          bumpMap={tex.dogBump}
          bumpScale={0.02}
          roughnessMap={tex.dogRough}
          roughness={1}
          metalness={0}
          clearcoat={0.45}
          clearcoatRoughness={0.42}
          sheen={0.3}
          sheenColor="#ff9a7a"
        />
      </mesh>

      {/* mustard */}
      <mesh geometry={mustard} castShadow>
        <meshPhysicalMaterial
          color="#f7b500"
          roughnessMap={tex.sauceRough}
          roughness={1}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.12}
        />
      </mesh>

      {/* ketchup, tucked around the far side so the two never fight */}
      <mesh geometry={ketchup} castShadow>
        <meshPhysicalMaterial
          color="#c8102e"
          roughnessMap={tex.sauceRough}
          roughness={1}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.16}
        />
      </mesh>
    </group>
  );
}
