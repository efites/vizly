import {Box, Paper, Typography} from '@mui/material'
import {useEffect, useRef} from 'react'

import {useChartContext} from '../context/ChartContext'
import DraggableImage from './DraggableImage'

interface WorkspaceCanvasProps {
  zoomLevel: number
}

const WorkspaceCanvas = ({zoomLevel}: WorkspaceCanvasProps) => {
  const {selectedCharts, deselectAllCharts} = useChartContext()
  const canvasRef = useRef<HTMLDivElement>(null)

  // Handle background click to deselect all images
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === canvasRef.current) {
      deselectAllCharts()
    }
  }

  // Adjust canvas to zoom level
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.style.transform = `scale(${zoomLevel})`
      canvas.style.transformOrigin = 'center center'
    }
  }, [zoomLevel])

  console.log(selectedCharts)

  return (
    <Paper
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">Workspace</Typography>
        <Typography variant="body2" color="text.secondary">
          {selectedCharts.length} chart{selectedCharts.length !== 1 ? 's' : ''} in workspace • {Math.round(zoomLevel * 100)}% zoom
        </Typography>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          position: 'relative',
          overflow: 'auto',
          backgroundColor: 'rgb(245, 247, 250)',
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          transition: 'background-size 0.2s ease',
        }}
        onClick={handleCanvasClick}
      >
        <Box
          ref={canvasRef}
          sx={{
            minHeight: '100%',
            minWidth: '100%',
            height: 2000,
            width: 2000,
            position: 'relative',
            transition: 'transform 0.2s ease',
          }}
        >
          {selectedCharts.map((chart) => (
            <DraggableImage
              key={chart.id}
              chart={chart}
            />
          ))}

          {selectedCharts.length === 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                color: 'text.secondary',
                p: 4,
              }}
            >
              <Typography variant="h6">No charts selected</Typography>
              <Typography variant="body2">
                Select charts from the list to add them to the workspace
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  )
}

export default WorkspaceCanvas
