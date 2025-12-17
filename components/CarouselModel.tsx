'use client'

import * as THREE from 'three'
import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Plane, Image as Image2D, Text, useCursor } from '@react-three/drei'
import { easing } from 'maath'
import { CardProps, deltaShortest } from '@/lib/utils'
import useAnimationContext from '@/hooks/useAnimationContext'

// Define cards array with corrected image paths
const cards: CardProps[] = [
  { url: '/images/image1.JPG', text: 'Card 1', targetRotation: 0 },
  { url: '/images/image2.jpeg', text: 'Card 2', targetRotation: 0 },
  { url: '/images/image3.jpeg', text: 'Card 3', targetRotation: 0 },
  { url: '/images/image4.jpeg', text: 'Card 4', targetRotation: 0 },
  { url: '/images/image5.jpeg', text: 'Card 5', targetRotation: 0 },
  { url: '/images/image6.jpg', text: 'Card 6', targetRotation: 0 },
  { url: '/images/image7.JPG', text: 'Card 7', targetRotation: 0 },
]

const count = cards.length
const updatedCards: CardProps[] = cards.map((card, i) => ({
  ...card,
  targetRotation: (i * 2 * Math.PI) / count
}))

export default function Carousel({ radius = 0.7 }: { radius?: number }) {
  const group = useRef<THREE.Group>(null!)
  const { stage } = useAnimationContext()
  const [selectedCard, setSelectedCard] = useState<CardProps | null>(null)
  const [visible, setVisible] = useState(false)

  // Intro: show only when stage.id === 'carousel'
  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (stage.id === 'carousel') {
      timeout = setTimeout(() => setVisible(true), 1500)
    } else {
      setVisible(false)
      setSelectedCard(null)
    }
    return () => clearTimeout(timeout)
  }, [stage.id])

  useFrame((_, delta) => {
    // scale intro
    const targetScale = visible ? 1 : 0
    const scaleFactor = visible ? 0.8 : 0.4
    easing.damp(group.current.scale, 'x', targetScale, scaleFactor, delta)
    easing.damp(group.current.scale, 'y', targetScale, scaleFactor, delta)
    easing.damp(group.current.scale, 'z', targetScale, scaleFactor, delta)

    // rotation logic
    const r = group.current.rotation
    if (selectedCard) {
      const d = deltaShortest(selectedCard.targetRotation, r.y)
      easing.damp(r, 'y', r.y + d, 0.1, delta)
    } else {
      r.y += 0.0008
    }
  })

  return (
    <>
      <Plane
        args={[10, 10]}
        position={[0, 0, -2]}
        visible={false}
        onClick={(e) => { e.stopPropagation(); setSelectedCard(null) }}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Plane>

      <group ref={group} scale={[0, 0, 0]}>
        {updatedCards.map((card, i) => {
          const angle = (i * 2 * Math.PI) / count
          return (
            <group
              key={i}
              position={[-Math.sin(angle) * radius, 0, Math.cos(angle) * radius]}
              rotation={[0, -angle, 0]}
              onClick={(e) => { e.stopPropagation(); setSelectedCard(card) }}
              scale={0.8}
            >
              <Card url={card.url} text={card.text} selected={card === selectedCard} />
            </group>
          )
        })}
      </group>
    </>
  )
}

interface CardComponentProps {
  url: string
  text: string
  selected: boolean
}

function Card({ url, selected, text }: CardComponentProps) {
  const imageRef = useRef<THREE.Mesh>(null!)
  const textRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  useCursor(hovered, 'pointer', 'auto')

  // Fallback to a placeholder if image fails to load
  const imageUrl = imageError 
    ? 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23334155" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23fff" font-size="24"%3EImage Error%3C/text%3E%3C/svg%3E' 
    : url

  useFrame((state, delta) => {
    if (!imageRef.current) return
    
    easing.damp3(imageRef.current.scale, selected || hovered ? 0.6 : 0.5, 0.1, delta)
    easing.damp(imageRef.current.material, 'radius', selected || hovered ? 0.16 : 0.08, 0.2, delta)
    easing.damp(imageRef.current.material, 'zoom', selected || hovered ? 1 : 1.4, 0.2, delta)
    easing.damp(imageRef.current.material, 'opacity', selected || hovered ? 1 : 0.7, 0.2, delta)
    
    if (textRef.current) {
      easing.damp(textRef.current.material, 'opacity', selected ? 0.75 : 0, 0.2, delta)
      textRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.02
    }
  })

  return (
    <>
      <Image2D
        ref={imageRef}
        url={imageUrl}
        radius={0.05}
        transparent
        side={THREE.DoubleSide}
        onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
        onPointerOut={(e) => (e.stopPropagation(), setHovered(false))}
      />
      <Text
        ref={textRef}
        font='/fonts/Degular-Black.otf'
        fontSize={0.1}
        letterSpacing={-0.04}
        color='white'
        material-transparent
        material-opacity={0}
        position={[0, 0, 0.001]}
        anchorX='center'
        anchorY='middle'
      >
        {text.toUpperCase()}
      </Text>
    </>
  )
}