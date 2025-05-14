
import {Box, Container, Grid, Typography} from '@mui/material'
import {useState} from 'react'

import Header from '../../components/Header'
import ImageSelector from '../../components/ImageSelector'
import WorkspaceCanvas from '../../components/WorkspaceCanvas'
import {useChartContext} from '../../context/ChartContext'

export const Dashboard = () => {
	const [zoomLevel, setZoomLevel] = useState<number>(1)
	const {isLoading, error} = useChartContext()

	const handleZoomChange = (newZoom: number) => {
		setZoomLevel(newZoom)
	}

	return (
		<Box sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
			<Header onZoomChange={handleZoomChange} zoomLevel={zoomLevel} />

			<Container maxWidth="xl" sx={{flexGrow: 1, py: 3}}>
				{error && (
					<Typography sx={{mb: 2}} color="error">
						{error}
					</Typography>
				)}

				<Box sx={{height: '100%', display: 'flex', gap: '20px'}} container>
					<Grid item lg={2} md={3} sx={{height: '100%'}} xs={12}>
						<ImageSelector loading={isLoading} />
					</Grid>
					<Grid item lg={10} md={9} sx={{height: '100%', flex: '1 1 auto'}} xs={12}>
						<WorkspaceCanvas zoomLevel={zoomLevel} />
					</Grid>
				</Box>
			</Container>
		</Box>
	)
}
