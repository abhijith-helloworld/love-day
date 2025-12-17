'use client'

import * as THREE from 'three'
import React, { JSX, useRef, useState } from 'react'
import { useGLTF, Float, useCursor } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { GLTF } from 'three-stdlib'
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

export default function EnvelopeModel(
  props: JSX.IntrinsicElements['group']
) {
  const group = useRef<THREE.Group>(null!)
  const cover = useRef<THREE.Object3D>(null!)

  const { nodes, materials } = useGLTF('/envelope.glb') as unknown as GLTFResult

  const [hovered, setHovered] = useState(false)
  const { stage, nextStage } = useAnimationContext()

  useCursor(hovered, 'pointer', 'auto')

  useFrame((_, delta) => {
    if (!group.current || !cover.current) return

    const isActive = stage?.id === 'envelope'

    // 🔹 SCALE (never go exact zero → laptop GPU safe)
    const targetScale = isActive
      ? hovered ? 0.4 : 0.25
      : 0.001

    easing.damp3(group.current.scale, targetScale, 0.35, delta)

    if (!isActive) {
      easing.damp(
        cover.current.rotation,
        'x',
        -1.4,
        0.3,
        delta
      )
      return
    }

    // 🔹 ROTATION
    if (hovered) {
      const currentY = group.current.rotation.y
      const shortest = deltaShortest(0, currentY)

      easing.damp(
        group.current.rotation,
        'y',
        currentY + shortest,
        0.25,
        delta
      )

      easing.damp(
        cover.current.rotation,
        'x',
        -0.7,
        0.25,
        delta
      )
    } else {
      group.current.rotation.y += 0.005

      easing.damp(
        cover.current.rotation,
        'x',
        -0.2,
        0.25,
        delta
      )
    }
  })

  return (
    <Float
      speed={6}
      rotationIntensity={hovered ? 0.4 : 0}
      floatIntensity={0.5}
    >
      <group
        ref={group}
        {...props}
        dispose={null}
        position={[0, 0.15, 0.4]}
        rotation={[Math.PI, 0, 0]} // 🔥 camera-facing fix
        scale={0.001}              // 🔥 start hidden safely
        onClick={nextStage}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <group name="Circle001">
          <skinnedMesh
            geometry={nodes.Circle001_1.geometry}
            material={materials['Material.008']}
            skeleton={nodes.Circle001_1.skeleton}
          />
          <skinnedMesh
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
