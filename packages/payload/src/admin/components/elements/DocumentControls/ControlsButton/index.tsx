import React from 'react'

import './index.scss'

const baseClass = 'doc-controls-button'

export const ControlsButton: React.FC<{
  className?: string
  ariaLabel?: string
}> = (props) => {
  const { className, ariaLabel } = props

  return (
    <div className={[baseClass, className].filter(Boolean).join(' ')} aria-label={ariaLabel}>
      <div />
      <div />
      <div />
    </div>
  )
}
