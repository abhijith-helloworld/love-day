"use client"

import React from 'react';
import CarouselModel from './CarouselModel';
import HeartModel from './HeartModel';
import { useThree } from '@react-three/fiber';
import EnvelopeModel from './EnvelopeModel';
import FinalTextModel from './FinalTextModel';

export default function Main() {
  const { viewport } = useThree();
  const fit = Math.min(viewport.width, viewport.height)
  const padding = 0.8

  return (
    <group scale={fit * padding} position={[0, 0, -3]}>
      <EnvelopeModel />
      <HeartModel />
      <CarouselModel />
      <FinalTextModel />
    </group>
  )
}
