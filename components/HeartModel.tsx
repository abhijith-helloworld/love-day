'use client'

import * as THREE from 'three'
import React, { JSX, useRef, useState, useEffect } from 'react'
import { useGLTF, Text, MeshTransmissionMaterial, useCursor } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { useFrame } from '@react-three/fiber'
import { useDrag } from '@use-gesture/react'
import { easing } from 'maath'
import useAnimationContext from '@/hooks/useAnimationContext'

type GLTFResult = GLTF & {
  nodes: {
    Heart: THREE.Mesh
  }
}

export default function HeartModel(props: JSX.IntrinsicElements['group']) {
  const heartRef = useRef<THREE.Mesh>(null!);
  const textRef1 = useRef<THREE.Mesh>(null!)
  const textRef2 = useRef<THREE.Mesh>(null!)
  const { nodes } = useGLTF('/heart.glb') as unknown as GLTFResult;
  const velocity = useRef(0);
  const [hovered, setHovered] = useState(false)
  const [grabbing, setGrabbing] = useState(false)
  const [heartVisible, setHeartVisible] = useState(false)
  const [showText, setShowText] = useState(false)
  const { stage } = useAnimationContext();

  useCursor(hovered, 'pointer', 'auto')
  useCursor(grabbing, 'grabbing', 'pointer')

  const [pulsing, setPulsing] = useState(false)
  const pulseRef = useRef(0)
  const PULSE_DURATION = 0.5 // seconds

  useEffect(() => {
    if (stage.id === 'heart') {
      const showModel = setTimeout(() => {
        setHeartVisible(true)
        const showTextTimeout = setTimeout(() => {
          setShowText(true)
        }, 1500)
        return () => clearTimeout(showTextTimeout)
      }, 1000)
      return () => clearTimeout(showModel)
    } else {
      if (stage.id !== 'carousel') {
        setHeartVisible(false)
      }
      setShowText(false)
    }
  }, [stage.id])

  useFrame((_, delta) => {
    const targetScale = heartVisible ? 1 : 0
    const scaleFactor = heartVisible ? 1 : 0.5
    easing.damp(heartRef.current.scale, 'x', targetScale, scaleFactor, delta)
    easing.damp(heartRef.current.scale, 'y', targetScale, scaleFactor, delta)
    easing.damp(heartRef.current.scale, 'z', targetScale, scaleFactor, delta)

    if (textRef1.current && textRef2.current) {
      easing.damp(textRef1.current.material, 'opacity', showText ? 1 : 0, showText ? 2 : 1, delta)
      easing.damp(textRef2.current.material, 'opacity', showText ? 1 : 0, showText ? 1.2 : 0.6, delta)
    }

    if (heartRef.current) {
      if (!grabbing) {
        heartRef.current.rotation.z += 0.01;
      }
      heartRef.current.rotation.z += velocity.current;
      velocity.current *= 0.95;
    }

    if (pulsing) {
      pulseRef.current += delta;
      const t = pulseRef.current / PULSE_DURATION;
      if (t >= 1) {
        setPulsing(false);
        pulseRef.current = 0;
        heartRef.current.scale.set(1, 1, 1);
      } else {
        const scale = 1 + Math.sin(Math.PI * t) * 0.1;
        heartRef.current.scale.set(scale, scale, scale);
      }
    }
  });

  const materialProps = {
    thickness: 0.2,
    roughness: 0,
    transmission: 1,
    ior: 1.1,
    chromaticAberration: 0.3,
    backside: true,
    color: '#ff5454',
    envMapIntensity: 1,
  }

  const bind = useDrag(
    ({ movement: [mx], active }) => {
      setGrabbing(active)
      setPulsing(true)
      if (active) {
        velocity.current = mx / 6000
      }
    },
    {
      pointer: { touch: true },
      filterTaps: true,
      axis: 'x',
    }
  )

  return (
    <group {...props}>
      <Text
        ref={textRef1}
        fontSize={0.25}
        textAlign='center'
        position={[0, 0.85, -1]}
        font='/fonts/Degular-Thin.otf'
        color="black"
        material-transparent
        material-opacity={0}
      >
        love you too...
      </Text>
      <Text
        ref={textRef2}
        fontSize={1.9}
        textAlign='center'
        position={[0, 0, -1]}
        font='/fonts/DSNarXC.ttf'
        color="black"
        material-transparent
        material-opacity={0}
      >
        Devumma
      </Text>
      <mesh
        ref={heartRef}
        {...nodes.Heart}
        onClick={(e) => {
          e.stopPropagation()
          if (!pulsing) setPulsing(true)
        }}
        onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
        onPointerOut={(e) => (e.stopPropagation(), setHovered(false))}
        {...bind()}
        scale={[0, 0, 0]}
      >
        <MeshTransmissionMaterial {...materialProps} />
      </mesh>
    </group>
  )
}

useGLTF.preload('/heart.glb')
