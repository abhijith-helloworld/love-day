'use client'

import { Stage, stageArray } from '@/lib/utils';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AnimationContextType {
  stage: Stage;
  setStage: (stage: Stage) => void;
  nextStage: () => void;
}

const AnimationContext = createContext<AnimationContextType | null>(null);

export const AnimationProvider = ({ children }: { children: ReactNode }) => {
  const [stage, setStage] = useState<AnimationContextType['stage']>(stageArray[0]);

  function nextStage() {
    const currentIndex = stageArray.findIndex(s => s.id === stage.id);
    if (currentIndex < stageArray.length - 1) {
      setStage(stageArray[currentIndex + 1]);
    } else {
      setStage(stageArray[0]);
    }
  }

  return (
    <AnimationContext.Provider value={{ stage, setStage, nextStage }}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimationContext = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimationContext must be used within an AnimationProvider');
  }
  return context;
};

export default useAnimationContext;
