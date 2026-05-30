import { useId, useState } from 'react'
import { GLOSSARY } from '../glossary.js'

// Wraps a word or phrase with a dotted underline. On hover or keyboard focus
// it reveals a small popover explaining the term. `id` selects the definition
// from the glossary; `children` is the visible text (defaults to the title).
export default function Term({ id, children }) {
  const entry = GLOSSARY[id]
  const [open, setOpen] = useState(false)
  const tipId = useId()

  if (!entry) return <span>{children}</span>

  return (
    <span
      className="term"
      tabIndex={0}
      role="button"
      aria-describedby={open ? tipId : undefined}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children || entry.title}
      <span
        id={tipId}
        role="tooltip"
        className={`term-pop ${open ? 'is-open' : ''}`}
      >
        <strong className="term-pop__title">{entry.title}</strong>
        <span className="term-pop__body">{entry.body}</span>
      </span>
    </span>
  )
}
