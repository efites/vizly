import type { ReactNode} from 'react';

import React, {createContext, use, useEffect, useState} from 'react'

import type {ChartWithPosition, IChart} from '../types/chartTypes'

import {getChartImages} from '../api/charts'


interface ChartContextProps {
  allCharts: IChart[]
  error: string | null
  isLoading: boolean
  selectedCharts: ChartWithPosition[]
  deselectAllCharts: () => void
  removeChart: (id: string) => void
  selectChart: (chart: IChart) => void
  toggleChartSelection: (id: string) => void
  updateChartPosition: (id: string, x: number, y: number) => void
  updateChartSize: (id: string, width: number, height: number) => void
}

const ChartContext = createContext<ChartContextProps | undefined>(undefined)

export const ChartProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [allCharts, setAllCharts] = useState<IChart[]>([])
  const [selectedCharts, setSelectedCharts] = useState<ChartWithPosition[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all available charts
  useEffect(() => {
    const fetchCharts = async () => {
      setIsLoading(true)
      try {
        const response = await getChartImages()
        if (response && response.data.charts) {
          setAllCharts(response.data.charts)
        } else {
          setError('Failed to fetch charts')
        }
      } catch (err) {
        setError('An error occurred while fetching charts')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCharts()
  }, [])

  // Add a chart to the workspace
  const selectChart = (chart: IChart) => {
    // Check if chart is already selected
    const exists = selectedCharts.some((c) => c.filename === chart.filename)
    if (exists) return

    // Create a new chart with position data
    const newChart: ChartWithPosition = {
      ...chart,
      positionX: 20,
      positionY: 20,
      currentWidth: chart.width,
      currentHeight: chart.height,
      selected: false,
      id: Date.now().toString(),
    }

    setSelectedCharts((prev) => [...prev, newChart])
  }

  // Remove a chart from the workspace
  const removeChart = (id: string) => {
    setSelectedCharts((prev) => prev.filter((chart) => chart.id !== id))
  }

  // Update chart position
  const updateChartPosition = (id: string, x: number, y: number) => {
    setSelectedCharts((prev) =>
      prev.map((chart) => {
        if (chart.id === id) {
          return {...chart, positionX: x, positionY: y}
        }
        return chart
      })
    )
  }

  // Update chart size
  const updateChartSize = (id: string, width: number, height: number) => {
    setSelectedCharts((prev) =>
      prev.map((chart) => {
        if (chart.id === id) {
          return {...chart, currentWidth: width, currentHeight: height}
        }
        return chart
      })
    )
  }

  // Toggle chart selection
  const toggleChartSelection = (id: string) => {
    setSelectedCharts((prev) =>
      prev.map((chart) => {
        if (chart.id === id) {
          return {...chart, selected: !chart.selected}
        }
        // Deselect other charts when one is selected
        return {...chart, selected: false}
      })
    )
  }

  // Deselect all charts
  const deselectAllCharts = () => {
    setSelectedCharts((prev) =>
      prev.map((chart) => ({
        ...chart,
        selected: false,
      }))
    )
  }

  return (
    <ChartContext
      value={{
        allCharts,
        selectedCharts,
        isLoading,
        error,
        selectChart,
        removeChart,
        updateChartPosition,
        updateChartSize,
        toggleChartSelection,
        deselectAllCharts,
      }}
    >
      {children}
    </ChartContext>
  )
}

export const useChartContext = () => {
  const context = use(ChartContext)
  if (context === undefined) {
    throw new Error('useChartContext must be used within a ChartProvider')
  }
  return context
}
