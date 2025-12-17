"use client"

import React, { useState } from 'react';
import GradientButton from './GradientButton';
import Magnet from './Magnet';
import useAnimationContext from '@/hooks/useAnimationContext';
import ReverseMagnet from './ReverseMagnet';

export default function FinalQuestion() {
  const { stage, nextStage } = useAnimationContext()
  const [hidden, setHidden] = useState(false);

  const isActive = stage.id === 'question'
  const duration = isActive ? stage.fadeIn ?? 300 : stage.fadeOut ?? 200
  const delay = isActive ? stage.delay ?? 0 : 0

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center flex flex-col gap-32 w-full p-8"
      style={{
        pointerEvents: isActive ? 'auto' : 'none',
      }}
      >
      <h1
        className="text-6xl font-thin"
        style={{
          opacity: isActive ? 1 : 0,
          transition: `opacity ${duration}ms ease ${delay}ms`,
        }}
      >
        Você quer namorar comigo?
      </h1>
      <div className="flex justify-around">
        <Magnet style={{
          opacity: isActive ? 1 : 0,
          transition: `opacity ${duration}ms ease ${delay+1000}ms`,
        }} padding={200} magnetStrength={1}>
          <GradientButton onClick={nextStage}>
            <span>Sim</span>
          </GradientButton>
        </Magnet>
        <ReverseMagnet style={{
          display: hidden ? 'none' : 'block',
          opacity: isActive ? 1 : 0,
          transition: `opacity ${duration}ms ease ${delay+1500}ms`,
        }} repulsionStrength={100} padding={200}>
          <GradientButton onClick={() => setHidden(true)}>
            <span>Não</span>
          </GradientButton>
        </ReverseMagnet>
      </div>
    </div>
  )
}