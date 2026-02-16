'use client'
import { useState, useEffect } from 'react'

const areas = [
  'Wildwood',
  'Conejo Oaks Area',
  'North Central TO',
  'Northeast TO',
  'Hillcrest East',
  'Thousand Oaks South',
  'Sunset Hills / Copperwood',
  'Shadow Oaks / Eichler',
  'Kevington / New Meadows',
  'Lynn Ranch'
]

export function StickyNav() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeArea, setActiveArea] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      // Show nav after scrolling past hero
      setIsVisible(window.scrollY > 600)

      // Determine active section
      const sections = areas.map(area => 
        document.getElementById(area.toLowerCase().replace(/\s+/g, '-'))
      )
      
      const scrollPosition = window.scrollY + 200

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPosition) {
          setActiveArea(areas[i])
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToArea = (area: string) => {
    const element = document.getElementById(area.toLowerCase().replace(/\s+/g, '-'))
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  if (!isVisible) return null

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center overflow-x-auto py-3 space-x-1">
          <span className="text-sm font-medium text-gray-500 mr-4 flex-shrink-0">Jump to:</span>
          {areas.map((area) => (
            <button
              key={area}
              onClick={() => scrollToArea(area)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                activeArea === area
                  ? 'bg-[#29B6F6] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
