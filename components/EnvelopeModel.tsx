'use client'

import * as THREE from 'three'
import React, { JSX, useRef, useState } from 'react'
import { useGLTF, Float, useCursor } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { deltaShortest } from '@/lib/utils'
import { useAnimationContext } from '@/hooks/useAnimationContext'

type GLTFResult = GLTF & {
  nodes: {
    Circle001_1: THREE.SkinnedMesh
    Circle001_2: THREE.SkinnedMesh
    Envelope: THREE.Bone
    Cover: THREE.Bone
  }
  materials: {
    ['Material.008']: THREE.MeshStandardMaterial
    ['Material.007']: THREE.MeshStandardMaterial
  }
}

export default function EnvelopeModel(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>(null!)
  const cover = useRef<THREE.Mesh>(null!)
  const { nodes, materials } = useGLTF('/envelope.glb') as unknown as GLTFResult
  const [hovered, setHovered] = useState(false);
  const { stage, nextStage } = useAnimationContext();

  useCursor(hovered, 'pointer', 'auto')

  const onPointerOver = () => setHovered(true);
  const onPointerOut = () => setHovered(false);

  useFrame((_, delta) => {
    if (stage && stage.id === 'envelope') {
      const targetScale = hovered ? 0.4 : 0.25
      easing.damp(group.current.scale, 'x', targetScale, 0.3, delta)
      easing.damp(group.current.scale, 'y', targetScale, 0.3, delta)
      easing.damp(group.current.scale, 'z', targetScale, 0.3, delta)

      if (hovered) {
        const currentY = group.current.rotation.y
        const shortest = deltaShortest(0, currentY)
        easing.damp(group.current.rotation, 'y', currentY + shortest, 0.2, delta)

        easing.damp(cover.current.rotation, 'x', -0.7, 0.2, delta)
      } else {
        group.current.rotation.y += 0.005

        easing.damp(cover.current.rotation, 'x', -0.2, 0.2, delta)
      }
    } else {
      easing.damp(cover.current.rotation, 'x', -1.4, 0.3, delta)

      easing.damp(group.current.scale, 'x', 0, 0.4, delta)
      easing.damp(group.current.scale, 'y', 0, 0.4, delta)
      easing.damp(group.current.scale, 'z', 0, 0.4, delta)

      return
    }
  })


  return (
    <Float
      speed={8}
      rotationIntensity={hovered ? 0.5 : 0}
      floatIntensity={0.5}
    >
      <group name="Scene"
        ref={group}
        {...props}
        dispose={null}
        position={[0, 0.15, 0.4]}
        rotation={[-Math.PI, 0, 0]}
        scale={0.25}
        onClick={nextStage}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        <group name="Circle001">
          <skinnedMesh
            name="Circle001_1"
            geometry={nodes.Circle001_1.geometry}
            material={materials['Material.008']}
            skeleton={nodes.Circle001_1.skeleton}
          />
          <skinnedMesh
            name="Circle001_2"
            geometry={nodes.Circle001_2.geometry}
            material={materials['Material.007']}
            skeleton={nodes.Circle001_2.skeleton}
          />
        </group>
        <primitive object={nodes.Envelope} />
        <primitive ref={cover} object={nodes.Cover} />
    </group>
  </Float>
  )
}

useGLTF.preload('/envelope.glb')