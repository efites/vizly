import {
  Avatar,
  Box,
  Chip,
  Divider,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper, TextField,
  Typography
} from '@mui/material'
import {Image, Search} from 'lucide-react'
import {useState} from 'react'

import {useChartContext} from '../context/ChartContext'
import {formatDate, formatFileSize} from '../utils/formatters'


interface ImageSelectorProps {
  loading: boolean
}

const ImageSelector = ({loading}: ImageSelectorProps) => {
  const {allCharts, selectChart} = useChartContext()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCharts = allCharts.filter(chart =>
    chart.filename.toLowerCase().includes(searchTerm.toLowerCase())
  )

  console.log(allCharts)

  return (
    <Paper
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box sx={{p: 2, borderBottom: 1, borderColor: 'divider'}}>
        <Typography variant="h6" gutterBottom>
          Available Charts
        </Typography>
        <TextField
          fullWidth
          size="small"
          sx={{mb: 1}}
          value={searchTerm}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} />
              </InputAdornment>
            ),
          }}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search charts..."
        />
        <Typography variant="body2" color="text.secondary">
          {filteredCharts.length} charts available
        </Typography>
      </Box>

      <List sx={{flexGrow: 1, overflow: 'auto', p: 0}}>
        {filteredCharts.length > 0 ? (
          filteredCharts.map((chart, index) => (
            <Box key={chart.filename}>
              {index > 0 && <Divider />}
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    py: 1.5,
                    transition: 'background-color 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                  onClick={() => selectChart(chart)}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 1
                      }}
                      src={chart.download_url}
                      variant="rounded"
                    >
                      <Image />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" noWrap>
                        {chart.filename}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{mt: 0.5}}>
                        <Chip
                          sx={{
                            fontSize: '0.7rem',
                            height: 20,
                            mr: 0.5,
                            backgroundColor: 'rgba(0, 0, 0, 0.05)'
                          }}
                          label={`${chart.width}×${chart.height}`}
                          size="small"
                        />
                        <Chip
                          sx={{
                            fontSize: '0.7rem',
                            height: 20,
                            backgroundColor: 'rgba(0, 0, 0, 0.05)'
                          }}
                          label={formatFileSize(chart.size)}
                          size="small"
                        />
                        <Typography display="block" sx={{mt: 0.5}} variant="caption">
                          Created: {formatDate(chart.created_at)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            </Box>
          ))
        ) : (
          <Box sx={{p: 3, textAlign: 'center'}}>
            <Typography color="text.secondary">
              No charts found matching {searchTerm}
            </Typography>
          </Box>
        )}
      </List>
    </Paper>
  )
}

export default ImageSelector
