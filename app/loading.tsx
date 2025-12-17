import React from 'react'

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="cube-loader">
        <div className="cube-top"></div>
        <div className="cube-wrapper">
          <span className="cube-span [--i:0]" />
          <span className="cube-span [--i:1]" />
          <span className="cube-span [--i:2]" />
          <span className="cube-span [--i:3]" />
        </div>
      </div>
    </div>
  )
}
