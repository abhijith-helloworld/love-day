'use client'

import * as THREE from 'three'
import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Plane, Image as Image2D, Text, useCursor } from '@react-three/drei'
import { easing } from 'maath'
import { CardProps, cards, deltaShortest } from '@/lib/utils'
import useAnimationContext from '@/hooks/useAnimationContext'

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

  // 🎬 show only when carousel stage active
  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined

    if (stage?.id === 'carousel') {
      timeout = setTimeout(() => setVisible(true), 800)
    } else {
      setVisible(false)
      setSelectedCard(null)
    }

    return () => timeout && clearTimeout(timeout)
  }, [stage?.id])

  useFrame((_, delta) => {
    if (!group.current) return

    // ❌ NEVER scale to exact zero (GPU safe)
    const targetScale = visible ? 1 : 0.001
    const speed = visible ? 0.8 : 0.5

    easing.damp3(group.current.scale, targetScale, speed, delta)

    // 🔄 rotation logic
    const r = group.current.rotation

    if (selectedCard) {
      const d = deltaShortest(selectedCard.targetRotation, r.y)
      easing.damp(r, 'y', r.y + d, 0.2, delta)
    } else {
      r.y += 0.001
    }
  })

  return (
    <>
      {/* invisible click catcher */}
      <Plane
        args={[10, 10]}
        position={[0, 0, -2]}
        visible={false}
        onClick={(e) => {
          e.stopPropagation()
          setSelectedCard(null)
        }}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Plane>

      <group ref={group} scale={0.001}>
        {updatedCards.map((card, i) => {
          const angle = (i * 2 * Math.PI) / count

          return (
            <group
              key={i}
              position={[
                -Math.sin(angle) * radius,
                0,
                Math.cos(angle) * radius
              ]}
              rotation={[0, -angle, 0]}
              scale={0.8}
              onClick={(e) => {
                e.stopPropagation()
                setSelectedCard(card)
              }}
            >
              <Card
                url={card.url}
                text={card.text}
                selected={card === selectedCard}
              />
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
  useCursor(hovered, 'pointer', 'auto')

  useFrame((state, delta) => {
    if (!imageRef.current || !textRef.current) return

    // 🖼 image animation
    easing.damp3(
      imageRef.current.scale,
      selected || hovered ? 0.6 : 0.5,
      0.15,
      delta
    )

    const mat = imageRef.current.material as any
    easing.damp(mat, 'radius', selected || hovered ? 0.16 : 0.08, 0.25, delta)
    easing.damp(mat, 'zoom', selected || hovered ? 1 : 1.4, 0.25, delta)
    easing.damp(mat, 'opacity', selected || hovered ? 1 : 0.7, 0.25, delta)

    // 📝 text animation
    easing.damp(
      (textRef.current.material as any),
      'opacity',
      selected ? 0.75 : 0,
      0.25,
      delta
    )

    textRef.current.position.y =
      Math.sin(state.clock.getElapsedTime() * 1.5) * 0.02
  })

  return (
    <>
      <Image2D
        ref={imageRef}
        url={url}
        radius={0.05}
        transparent
        side={THREE.DoubleSide}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          setHovered(false)
        }}
      />

      <Text
        ref={textRef}
        font="/fonts/Degular-Black.otf" // make sure file exists in /public/fonts
        fontSize={0.1}
        letterSpacing={-0.04}
        color="white"
        material-transparent
        material-opacity={0}
        position={[0, 0, 0.001]}
        anchorX="center"
        anchorY="middle"
      >
        {text.toUpperCase()}
      </Text>
    </>
  )
}
