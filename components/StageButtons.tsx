"use client"

import React from 'react';
import GradientButton from './GradientButton';
import Magnet from './Magnet';
import useAnimationContext from '@/hooks/useAnimationContext';
import { stageArray } from '@/lib/utils';

export default function StageButtons() {
  const { stage, nextStage } = useAnimationContext()

  return (
    <>
      {stageArray.map(config => {
        if (!config.buttonText) return null
        const isActive = stage.id === config.id
        const duration = isActive ? config.fadeIn ?? 300 : config.fadeOut ?? 200
        const delay = isActive ? config.delay ?? 0 : 0

        return (
          <Magnet
            key={config.id}
            wrapperClassName="absolute bottom-[15vh] left-1/2 -translate-x-1/2"
            style={{
              transform: `scale(${isActive ? 1 : 0})`,
              opacity: isActive ? 1 : 0,
              transition: `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms ease ${delay + 200}ms`,
            }}
          >
            <GradientButton onClick={nextStage}>
              <span>{config.buttonText}</span>
            </GradientButton>
          </Magnet>
        )
      })}
    </>
  )
}
