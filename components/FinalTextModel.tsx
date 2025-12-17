import * as THREE from 'three'
import { Center, MeshTransmissionMaterial, Text3D, useCursor } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import { useDrag } from '@use-gesture/react'
import { easing } from 'maath'
import { useAnimationContext } from '@/hooks/useAnimationContext'

export default function FinalTextModel() {
  const groupRef = useRef<THREE.Group>(null!)
  const velocity = useRef(0)
  const [grabbing, setGrabbing] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(false)
  const [showFirst, setShowFirst] = useState(true)
  const { stage } = useAnimationContext()

  // control visibility on stage change
  useEffect(() => {
    let introTimeout: NodeJS.Timeout
    let flipTimeout: NodeJS.Timeout
    if (stage.id === 'final') {
      introTimeout = setTimeout(() => setVisible(true), 2000)
      setShowFirst(true)
      flipTimeout = setTimeout(() => setShowFirst(false), 7000)
    } else {
      setVisible(false)
      setShowFirst(true)
    }
    return () => {
      clearTimeout(introTimeout)
      clearTimeout(flipTimeout)
    }
  }, [stage.id])

  useFrame((_, delta) => {
    const group = groupRef.current
    // intro/outro scale
    const targetScale = visible ? 0.5 : 0
    easing.damp(group.scale, 'x', targetScale, 0.3, delta)
    easing.damp(group.scale, 'y', targetScale, 0.3, delta)
    easing.damp(group.scale, 'z', targetScale, 0.3, delta)

    // rotation + drag momentum
    if (visible) {
      if (!grabbing) {
        group.rotation.y += delta * 0.8
      }
      group.rotation.y += velocity.current
      velocity.current *= 0.95
    }
  })

  useCursor(hovered, 'pointer', 'auto')
  useCursor(grabbing, 'grabbing', 'pointer')

  const bind = useDrag(
    ({ movement: [mx], active }) => {
      setGrabbing(active)
      if (active) {
        velocity.current = mx / 3000
      }
    },
    { pointer: { touch: true }, filterTaps: true, axis: 'x' }
  )

  const materialProps = {
    thickness: 0.7,
    roughness: 0.1,
    transmission: 1,
    ior: 1.1,
    chromaticAberration: 0.1,
    backside: true,
    color: '#CD8FE1',
    envMapIntensity: 1,
  }

  return (
    <Center
      ref={groupRef}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
      scale={[0, 0, 0]}
      {...bind()}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {showFirst ? (
        <Text3D
          font='/fonts/Inter_Bold.json'
          size={0.35}
          letterSpacing={-0.01}
          curveSegments={32}
          bevelEnabled
          bevelSize={0.02}
          bevelThickness={0.01}
        >
          E o cuzinho?
          <MeshTransmissionMaterial {...materialProps} />
        </Text3D>
      ) : (
        <Text3D
          font='/fonts/Inter_Bold.json'
          size={0.35}
          letterSpacing={-0.01}
          curveSegments={32}
          bevelEnabled
          bevelSize={0.02}
          bevelThickness={0.01}
        >
          Eu te amo!
          <MeshTransmissionMaterial {...materialProps} />
        </Text3D>
      )}
    </Center>
  )
}
