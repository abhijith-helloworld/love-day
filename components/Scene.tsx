'use client'

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { easing } from 'maath';
import Main from './Main';

function CameraParallax() {
  useFrame((state, delta) => {
    const { pointer, camera } = state
    const factor = 0.05
    easing.dampE(
      camera.rotation,
      [pointer.y * factor, -pointer.x * factor, 0],
      0.25,
      delta
    )
  })
  return null
}

export default function Scene() {  
  return (
    <Canvas>
      <color attach="background" args={['blick']} />
      <OrbitControls />
      <CameraParallax />
      <directionalLight intensity={3} position={[0, 3, 2]} />
      <Environment files="/hdr/cloudy.hdr" />
      <Main />
    </Canvas>
  )
}