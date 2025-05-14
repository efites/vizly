import React, {createContext, use, useEffect, useState} from 'react'

import type {IChart} from '../types/chartTypes'

import {getChartImages} from '../api/charts'


interface ChartWithPosition extends IChart {
  currentHeight: number
  currentWidth: number
  id: string
  positionX: number
  positionY: number
  selected: boolean
}

interface ChartContextType {
  allCharts: IChart[]
  error: string | null
  loading: boolean
  selectedCharts: ChartWithPosition[]
  deselectAllCharts: () => void
  removeChart: (id: string) => void
  selectChart: (chart: IChart) => void
  toggleChartSelection: (id: string) => void
  updateChartPosition: (id: string, x: number, y: number) => void
  updateChartSize: (id: string, width: number, height: number) => void
}

const ChartContext = createContext<ChartContextType | undefined>(undefined)

export const ChartProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [allCharts, setAllCharts] = useState<IChart[]>([])
  const [selectedCharts, setSelectedCharts] = useState<ChartWithPosition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const response = await getChartImages()
        if (response && response.data.charts) {
          setAllCharts(response.data.charts)
        }
      } catch (err) {
        setError('Failed to load charts')
      } finally {
        setLoading(false)
      }
    }

    fetchCharts()
  }, [])

  const selectChart = (chart: IChart) => {
    const exists = selectedCharts.some(c => c.download_url === chart.download_url)
    if (exists) return

    const newChart: ChartWithPosition = {
      ...chart,
      id: Date.now().toString(),
      positionX: 20,
      positionY: 20,
      currentWidth: chart.width,
      currentHeight: chart.height,
      selected: false
    }

    setSelectedCharts(prev => [...prev, newChart])
  }

  const removeChart = (id: string) => {
    setSelectedCharts(prev => prev.filter(chart => chart.id !== id))
  }

  const updateChartPosition = (id: string, x: number, y: number) => {
    setSelectedCharts(prev =>
      prev.map(chart =>
        chart.id === id ? {...chart, positionX: x, positionY: y} : chart
      )
    )
  }

  const updateChartSize = (id: string, width: number, height: number) => {
    setSelectedCharts(prev =>
      prev.map(chart =>
        chart.id === id ? {...chart, currentWidth: width, currentHeight: height} : chart
      )
    )
  }

  const toggleChartSelection = (id: string) => {
    setSelectedCharts(prev =>
      prev.map(chart => ({
        ...chart,
        selected: chart.id === id ? !chart.selected : false
      }))
    )
  }

  const deselectAllCharts = () => {
    setSelectedCharts(prev =>
      prev.map(chart => ({...chart, selected: false}))
    )
  }

  return (
    <ChartContext
      value={{
        allCharts,
        selectedCharts,
        loading,
        error,
        selectChart,
        removeChart,
        updateChartPosition,
        updateChartSize,
        toggleChartSelection,
        deselectAllCharts
      }}
    >
      {children}
    </ChartContext>
  )
}

export const useChartContext = () => {
  const context = use(ChartContext)
  if (!context) {
    throw new Error('useChartContext must be used within a ChartProvider')
  }
  return context
}
