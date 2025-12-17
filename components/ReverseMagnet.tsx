"use client"

import React, { useState, useEffect, useRef, ReactNode, HTMLAttributes } from "react";

interface ReverseMagnetProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: number;
  disabled?: boolean;
  repulsionStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  wrapperClassName?: string;
  innerClassName?: string;
}

const ReverseMagnet: React.FC<ReverseMagnetProps> = ({
  children,
  padding = 100,
  disabled = false,
  repulsionStrength = 50, // Default strength for repulsion effect
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.5s ease-in-out",
  wrapperClassName = "",
  innerClassName = "",
  ...props
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const magnetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) {
      setPosition({ x: 0, y: 0 });
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!magnetRef.current) return;

      const rect = magnetRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate distance from mouse to element center
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      // Activation radius includes padding
      const activationRadius = (Math.min(rect.width, rect.height) / 2) + padding;

      if (distance < activationRadius) {
        setIsActive(true);

        // Calculate normalized direction vector from mouse to center
        const dirX = distX / distance || 0; // Avoid division by zero
        const dirY = distY / distance || 0;

        // Calculate repulsion force (stronger when closer to element)
        const force = Math.min(repulsionStrength / distance, 1.5);

        // Apply repulsion in opposite direction of mouse
        setPosition({
          x: -dirX * force * repulsionStrength,
          y: -dirY * force * repulsionStrength
        });
      } else {
        setIsActive(false);
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [padding, disabled, repulsionStrength]);

  const transitionStyle = isActive ? activeTransition : inactiveTransition;

  return (
    <div
      ref={magnetRef}
      className={wrapperClassName}
      {...props}
    >
      <div
        className={innerClassName}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transition: transitionStyle,
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ReverseMagnet;