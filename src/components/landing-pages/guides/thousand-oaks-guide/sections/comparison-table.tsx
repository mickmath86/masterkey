'use client'
import { useState } from 'react'

const areas = [
  { name: 'Thousand Oaks South', amen: 9, transit: 9, school: 9, econ: 9, health: 10, crime: 10, value: 8, space: 8, score: 9.0 },
  { name: 'Wildwood', amen: 7, transit: 8, school: 9, econ: 9, health: 10, crime: 10, value: 8, space: 9, score: 8.8 },
  { name: 'Kevington Area', amen: 8, transit: 6, school: 10, econ: 9, health: 9, crime: 10, value: 6, space: 9, score: 8.4 },
  { name: 'Northeast TO', amen: 8, transit: 7, school: 9, econ: 8, health: 8, crime: 9, value: 7, space: 9, score: 8.1 },
  { name: 'Conejo Oaks Area', amen: 8, transit: 7, school: 9, econ: 8, health: 8, crime: 9, value: 6, space: 9, score: 8.0 },
  { name: 'Central TO', amen: 8, transit: 8, school: 8, econ: 8, health: 8, crime: 9, value: 7, space: 8, score: 8.0 },
  { name: 'Hillcrest East', amen: 9, transit: 8, school: 8, econ: 8, health: 8, crime: 9, value: 7, space: 7, score: 8.0 },
  { name: 'North Central', amen: 8, transit: 7, school: 8, econ: 8, health: 8, crime: 9, value: 7, space: 8, score: 7.9 },
  { name: 'Lynn Ranch', amen: 7, transit: 6, school: 7, econ: 9, health: 8, crime: 9, value: 7, space: 9, score: 7.8 },
  { name: 'Sunset Hills / Copperwood', amen: 5, transit: 3, school: 9, econ: 8, health: 8, crime: 9, value: 7, space: 9, score: 7.3 },
  { name: 'Shadow Oaks / Eichler', amen: 7, transit: 6, school: 5, econ: 8, health: 8, crime: 9, value: 7, space: 8, score: 7.3 },
]

type SortKey = 'name' | 'amen' | 'transit' | 'school' | 'econ' | 'health' | 'crime' | 'value' | 'space' | 'score'

export function ComparisonTable() {
  const [sortKey, setSortKey] = useState<SortKey>('score')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('desc')
    }
  }

  const sortedAreas = [...areas].sort((a, b) => {
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }
    
    return sortDirection === 'asc' 
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number)
  })

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'bg-green-500'
    if (score >= 7) return 'bg-[#29B6F6]'
    if (score >= 5) return 'bg-amber-500'
    return 'bg-red-500'
  }

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light text-[#29B6F6] mb-4">
            Area Comparison Summary Table
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Area Score = average of the 8 category scores (not a total). This keeps every area 
            on the same 1–10 scale and makes comparisons more intuitive.
          </p>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  onClick={() => handleSort('name')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Area {sortKey === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  onClick={() => handleSort('amen')}
                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Amen {sortKey === 'amen' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  onClick={() => handleSort('transit')}
                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Transit {sortKey === 'transit' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  onClick={() => handleSort('school')}
                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  School {sortKey === 'school' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  onClick={() => handleSort('econ')}
                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Econ {sortKey === 'econ' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  onClick={() => handleSort('health')}
                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Health {sortKey === 'health' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  onClick={() => handleSort('crime')}
                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Crime {sortKey === 'crime' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  onClick={() => handleSort('value')}
                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Value {sortKey === 'value' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  onClick={() => handleSort('space')}
                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Space {sortKey === 'space' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  onClick={() => handleSort('score')}
                  className="px-6 py-3 text-center text-xs font-medium text-[#29B6F6] uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Score {sortKey === 'score' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedAreas.map((area, idx) => (
                <tr key={area.name} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {area.name}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${getScoreColor(area.amen)}`}
                          style={{ width: `${area.amen * 10}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-700">{area.amen}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${getScoreColor(area.transit)}`}
                          style={{ width: `${area.transit * 10}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-700">{area.transit}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${getScoreColor(area.school)}`}
                          style={{ width: `${area.school * 10}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-700">{area.school}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${getScoreColor(area.econ)}`}
                          style={{ width: `${area.econ * 10}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-700">{area.econ}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${getScoreColor(area.health)}`}
                          style={{ width: `${area.health * 10}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-700">{area.health}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${getScoreColor(area.crime)}`}
                          style={{ width: `${area.crime * 10}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-700">{area.crime}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${getScoreColor(area.value)}`}
                          style={{ width: `${area.value * 10}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-700">{area.value}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${getScoreColor(area.space)}`}
                          style={{ width: `${area.space * 10}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-700">{area.space}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-lg font-bold text-[#29B6F6]">
                      {area.score.toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
