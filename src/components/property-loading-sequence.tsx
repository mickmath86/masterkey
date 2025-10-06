"use client"

import { useState, useEffect } from 'react'
import { CheckCircle, Clock, Database, Home, TrendingUp, Camera, MapPin, DollarSign } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

interface LoadingTask {
  id: string
  label: string
  icon: React.ComponentType<any>
  duration: number // milliseconds
  completed: boolean
}

interface PropertyLoadingSequenceProps {
  onComplete: () => void
  address: string
}

export function PropertyLoadingSequence({ onComplete, address }: PropertyLoadingSequenceProps) {
  const [tasks, setTasks] = useState<LoadingTask[]>([
    {
      id: 'property-data',
      label: 'Retrieving property information',
      icon: Home,
      duration: 1500,
      completed: false
    },
    {
      id: 'market-analysis',
      label: 'Analyzing market conditions',
      icon: TrendingUp,
      duration: 2000,
      completed: false
    },
    {
      id: 'property-images',
      label: 'Loading property images',
      icon: Camera,
      duration: 1800,
      completed: false
    },
    {
      id: 'location-data',
      label: 'Gathering neighborhood insights',
      icon: MapPin,
      duration: 1600,
      completed: false
    },
    {
      id: 'valuation',
      label: 'Calculating property valuation',
      icon: DollarSign,
      duration: 2200,
      completed: false
    },
    {
      id: 'final-report',
      label: 'Generating comprehensive report',
      icon: Database,
      duration: 1000,
      completed: false
    }
  ])

  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [allCompleted, setAllCompleted] = useState(false)

  useEffect(() => {
    if (currentTaskIndex >= tasks.length) {
      // All tasks completed, wait a moment then call onComplete
      setTimeout(() => {
        setAllCompleted(true)
        setTimeout(onComplete, 800)
      }, 500)
      return
    }

    const currentTask = tasks[currentTaskIndex]
    const timer = setTimeout(() => {
      setTasks(prev => 
        prev.map((task, index) => 
          index === currentTaskIndex 
            ? { ...task, completed: true }
            : task
        )
      )
      setCurrentTaskIndex(prev => prev + 1)
    }, currentTask.duration)

    return () => clearTimeout(timer)
  }, [currentTaskIndex, tasks.length, onComplete])

  const formatAddress = (address: string) => {
    // Truncate long addresses for display
    if (address.length > 50) {
      return address.substring(0, 47) + '...'
    }
    return address
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-sky-600 dark:text-sky-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Analyzing Your Property
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {formatAddress(address)}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Progress</span>
              <span>{Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-sky-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-4">
            {tasks.map((task, index) => {
              const isActive = index === currentTaskIndex && !task.completed
              const isCompleted = task.completed
              const isPending = index > currentTaskIndex

              return (
                <div 
                  key={task.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800' 
                      : isCompleted
                      ? 'bg-green-50 dark:bg-green-900/20'
                      : 'bg-gray-50 dark:bg-gray-700/50'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : isActive ? (
                      <Spinner className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium transition-colors ${
                      isCompleted 
                        ? 'text-green-800 dark:text-green-200' 
                        : isActive
                        ? 'text-sky-800 dark:text-sky-200'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {task.label}
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    <task.icon className={`w-4 h-4 transition-colors ${
                      isCompleted 
                        ? 'text-green-600 dark:text-green-400' 
                        : isActive
                        ? 'text-sky-600 dark:text-sky-400'
                        : 'text-gray-400 dark:text-gray-500'
                    }`} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Completion Message */}
          {allCompleted && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center space-x-2 text-green-600 dark:text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Analysis Complete!</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Powered by MasterKey AI • Secure & Confidential
          </p>
        </div>
      </div>
    </div>
  )
}
