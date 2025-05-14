import {
  AppBar,
  Box,
  IconButton,
  Slider,
  Toolbar,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material'
import {Download, Save, Trash2, ZoomIn, ZoomOut} from 'lucide-react'

import {useChartContext} from '../context/ChartContext'

interface HeaderProps {
  zoomLevel: number
  onZoomChange: (zoom: number) => void
}

const Header = ({zoomLevel, onZoomChange}: HeaderProps) => {
  const theme = useTheme()
  const {selectedCharts, removeChart} = useChartContext()

  const selectedChart = selectedCharts.find(chart => chart.selected)

  const handleZoomChange = (_event: Event, newValue: number | number[]) => {
    onZoomChange(newValue as number)
  }

  const handleZoomIn = () => {
    if (zoomLevel < 2) {
      onZoomChange(Math.min(zoomLevel + 0.1, 2))
    }
  }

  const handleZoomOut = () => {
    if (zoomLevel > 0.5) {
      onZoomChange(Math.max(zoomLevel - 0.1, 0.5))
    }
  }

  const handleDeleteSelected = () => {
    if (selectedChart) {
      removeChart(selectedChart.id)
    }
  }

  return (
    <AppBar
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper
      }}
      color="default"
      elevation={0}
      position="static"
    >
      <Toolbar>
        <Typography sx={{flexGrow: 1, fontWeight: 600}} variant="h6" component="div">
          Chart Viewer
        </Typography>

        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mx: 2,
          px: 2,
          borderRadius: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        }}>
          <Tooltip title="Zoom out">
            <IconButton disabled={zoomLevel <= 0.5} size="small" onClick={handleZoomOut}>
              <ZoomOut size={18} />
            </IconButton>
          </Tooltip>

          <Slider
            aria-labelledby="zoom-slider"
            max={2}
            min={0.5}
            step={0.1}
            sx={{width: 100, mx: 1}}
            value={zoomLevel}
            valueLabelDisplay="auto"
            onChange={handleZoomChange}
            valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
          />

          <Tooltip title="Zoom in">
            <IconButton disabled={zoomLevel >= 2} size="small" onClick={handleZoomIn}>
              <ZoomIn size={18} />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{display: 'flex', gap: 1}}>
          <Tooltip title="Save layout">
            <IconButton color="primary">
              <Save size={20} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Download chart">
            <IconButton color="primary">
              <Download size={20} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete selected">
            <span>
              <IconButton
                disabled={!selectedChart}
                color="error"
                onClick={handleDeleteSelected}
              >
                <Trash2 size={20} />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
