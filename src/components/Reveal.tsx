import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

/** Fades and lifts its children into view the first time they scroll on screen. */
export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
}: {
  children: ReactNode
  delay?: number
  as?: ElementType
  className?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'left',
  dark = false,
}: {
  eyebrow: string
  title: ReactNode
  intro?: ReactNode
  align?: 'left' | 'center'
  dark?: boolean
}) {
  return (
    <Reveal className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      <span className={`eyebrow ${dark ? '!text-ember' : ''}`}>{eyebrow}</span>
      <h2
        className={`font-display mt-4 text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl ${dark ? 'text-cream' : 'text-ink'}`}
      >
        {title}
      </h2>
      {intro && <p className={`mt-5 text-lg leading-relaxed ${dark ? 'text-cream/75' : 'text-ink/70'}`}>{intro}</p>}
    </Reveal>
  )
}
