'use client'

import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useEffect, useRef } from 'react'

export function AnimatedNumber({
  start,
  end,
  decimals = 0,
}: {
  start: number
  end: number
  decimals?: number
}) {
  let ref = useRef(null)
  let isInView = useInView(ref, { once: true, amount: 0.5 })

  let value = useMotionValue(start)
  let spring = useSpring(value, { damping: 30, stiffness: 100 })
  let display = useTransform(spring, (num) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num)
  })

  useEffect(() => {
    value.set(isInView ? end : start)
  }, [start, end, isInView, value])

  return <motion.span ref={ref}>{display}</motion.span>
}
