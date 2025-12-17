import React from 'react'

export default function GradientButton({ children, className, style, onClick }: { children: React.ReactNode, className?: string, style?: React.CSSProperties, onClick?: () => void }) {
  return (
    <button
      className={`relative px-8 py-2 overflow-hidden bg-zinc-900 transition-all duration-200 group inline-flex items-center justify-center whitespace-nowrap text-white font-bold rounded-xl text-2xl hover:scale-105 ring-offset-background focus-visible:outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${className}`}
      onClick={onClick}
      style={style}
    >
      {/* Gradient background effect */}
      <div
        className={"absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-40 group-hover:opacity-80 blur transition-opacity duration-500"}
      />

      {/* Content */}
      {children}
    </button>
  )
}
