import type { ResizeCallbackData} from 'react-resizable';

import {Box, Paper} from '@mui/material'
import {useRef, useState} from 'react'
import Draggable from 'react-draggable'
import {Resizable} from 'react-resizable'

import type {ChartWithPosition} from '../types/chartTypes'

import {useChartContext} from '../context/ChartContext'

import 'react-resizable/css/styles.css'

interface DraggableImageProps {
  chart: ChartWithPosition
}

const DraggableImage = ({chart}: DraggableImageProps) => {
  const {
    updateChartPosition,
    updateChartSize,
    toggleChartSelection
  } = useChartContext()

  const [position, setPosition] = useState({x: chart.positionX, y: chart.positionY})
  const [size, setSize] = useState({
    width: chart.currentWidth,
    height: chart.currentHeight
  })
  const [isDragging, setIsDragging] = useState(false)
  const nodeRef = useRef(null)

  // Handle drag events
  const handleDrag = (_e: any, data: {x: number; y: number}) => {
    setPosition({x: data.x, y: data.y})
  }

  const handleDragStop = (_e: any, data: {x: number; y: number}) => {
    updateChartPosition(chart.id, data.x, data.y)
    setIsDragging(false)
  }

  // Handle resize events
  const handleResize = (_e: React.SyntheticEvent, data: ResizeCallbackData) => {
    const {size} = data
    setSize({width: size.width, height: size.height})
  }

  const handleResizeStop = (_e: React.SyntheticEvent, data: ResizeCallbackData) => {
    const {size} = data
    updateChartSize(chart.id, size.width, size.height)
  }

  // Handle image selection
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleChartSelection(chart.id)
  }

  return (
    <Draggable
      handle=".drag-handle"
      bounds="parent"
      nodeRef={nodeRef}
      onDrag={handleDrag}
      onStart={() => setIsDragging(true)}
      onStop={handleDragStop}
      position={position}
    >
      <Box
        ref={nodeRef}
        sx={{
          position: 'absolute',
          cursor: isDragging ? 'grabbing' : 'grab',
          zIndex: chart.selected ? 10 : 1,
        }}
      >
        <Resizable
          handle={
            <Box
              sx={{
                position: 'absolute',
                width: 10,
                height: 10,
                bottom: 0,
                right: 0,
                cursor: 'se-resize',
                background: chart.selected ? 'primary.main' : 'rgba(0, 0, 0, 0.2)',
                borderRadius: '50%',
                zIndex: 2,
              }}
            />
          }
          height={size.height}
          width={size.width}
          onResize={handleResize}
          onResizeStop={handleResizeStop}
        >
          <Paper
            sx={{
              width: `${size.width}px`,
              height: `${size.height}px`,
              overflow: 'hidden',
              transition: 'box-shadow 0.2s ease',
              border: chart.selected ? 2 : 0,
              borderColor: 'primary.main',
              position: 'relative',
            }}
            elevation={chart.selected ? 8 : 1}
            onClick={handleClick}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                cursor: isDragging ? 'grabbing' : 'grab',
              }}
              className="drag-handle"
            >
              <img
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  pointerEvents: 'none',
                }}
                alt={chart.filename}
                src={chart.download_url}
              />
            </Box>
          </Paper>
        </Resizable>
      </Box>
    </Draggable>
  )
}

export default DraggableImage
