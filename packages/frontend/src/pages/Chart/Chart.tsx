import type {
	SelectChangeEvent
} from '@mui/material'

import {
	Alert,
	Box,
	Button,
	CircularProgress,
	FormControl,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	Snackbar,
	Typography,
} from '@mui/material'
import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip,
} from 'chart.js'
import {toPng} from 'html-to-image'
import React, {useEffect, useMemo, useRef, useState} from 'react'
import {Bar, Line, Scatter} from 'react-chartjs-2'

import type {IFile} from '../../types/IFiles'

import {getFiles} from '../../api/files'
import {sendImage} from '../../api/images'

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
)

interface files {
	[key: string]: number | string
}

interface CsvChartProps {
	files: files[]
}

export const Chart: React.FC<CsvChartProps> = () => {


	const [files, setFiles] = useState<IFile[]>([])

	const chartRef = useRef<HTMLDivElement>(null)
	const [isSaving, setIsSaving] = useState(false)
	const [snackbarOpen, setSnackbarOpen] = useState(false)
	const [snackbarMessage, setSnackbarMessage] = useState('')
	const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'success'>('success')

	const [xAxis, setXAxis] = useState<string>('')
	const [yAxis, setYAxis] = useState<string>('')
	const [chartType, setChartType] = useState<'bar' | 'line' | 'scatter'>('line')
	const [columns, setColumns] = useState<string[]>([])
	const [numericColumns, setNumericColumns] = useState<string[]>([])

	useEffect(() => {
		getFiles().then(data => {
			console.log(data)
			if (!data) return console.log('Файлов нет')

			setFiles(data.data)
		})
	}, [])

	// Анализируем данные при загрузке
	useEffect(() => {
		if (files.length > 0) {
			const cols = Object.keys(files[0])
			setColumns(cols)

			// Находим колонки с числовыми значениями
			const numericCols = cols.filter(col => {
				return files.some(item => {
					const val = item[col]
					return typeof val === 'number' ||
						(typeof val === 'string' && !Number.isNaN(Number.parseFloat(val)))
				})
			})

			setNumericColumns(numericCols)

			// Устанавливаем первые подходящие колонки по умолчанию
			if (cols.length >= 2) {
				setXAxis(cols[0])
				// Пытаемся найти числовую колонку для Y оси
				const defaultYAxis = numericCols.length > 0
					? numericCols[0]
					: cols.length > 1 ? cols[1] : ''
				setYAxis(defaultYAxis)
			}
		}
	}, [files])

	const handleXAxisChange = (event: SelectChangeEvent) => {
		setXAxis(event.target.value as string)
	}

	const handleYAxisChange = (event: SelectChangeEvent) => {
		setYAxis(event.target.value as string)
	}

	const handleChartTypeChange = (event: SelectChangeEvent) => {
		setChartType(event.target.value as 'bar' | 'line' | 'scatter')
	}

	// Преобразуем данные в числовой формат и фильтруем некорректные значения
	const processedData = useMemo(() => {
		return files.map(item => ({
			xValue: item[xAxis]?.toString() || '',
			yValue: typeof item[yAxis] === 'number'
				? item[yAxis] as number
				: Number.parseFloat(item[yAxis] as string) || null
		})).filter(item => item.yValue !== null)
	}, [files, xAxis, yAxis])

	const chartData = {
		labels: processedData.map(item => item.xValue),
		datasets: [
			{
				label: `${yAxis} by ${xAxis}`,
				data: processedData.map(item => item.yValue),
				backgroundColor: 'rgba(75, 192, 192, 0.6)',
				borderColor: 'rgba(75, 192, 192, 1)',
				borderWidth: 2,
				tension: 0.1,
				pointRadius: 5,
				pointHoverRadius: 7,
			},
		],
	}

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top' as const,
			},
			title: {
				display: true,
				text: `${xAxis} vs ${yAxis}`,
			},
			tooltip: {
				callbacks: {
					label: (context: any) => {
						return `${yAxis}: ${context.parsed.y}`
					}
				}
			}
		},
		scales: {
			x: {
				title: {
					display: true,
					text: xAxis,
				},
			},
			y: {
				title: {
					display: true,
					text: yAxis,
				},
			},
		},
	}

	const renderChart = () => {
		switch (chartType) {
			case 'bar':
				return <Bar data={chartData} options={options} />
			case 'line':
				return <Line data={chartData} options={options} />
			case 'scatter':
				return <Scatter data={chartData} options={options} />
			default:
				return <Line data={chartData} options={options} />
		}
	}

	const dataUrlToBlob = (dataUrl: string): Blob => {
		const arr = dataUrl.split(',')
		const mime = arr[0].match(/:(.*?);/)![1]
		const bstr = atob(arr[1])
		let n = bstr.length
		const u8arr = new Uint8Array(n)
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n)
		}
		return new Blob([u8arr], {type: mime})
	}

	const saveChartToServer = async () => {
		if (!chartRef.current) return

		setIsSaving(true)
		try {
			// Конвертируем график в PNG изображение
			const dataUrl = await toPng(chartRef.current, {
				quality: 0.1,
				//pixelRatio: 2, // для лучшего качества
			})

			// Отправляем как FormData вместо JSON для больших файлов
			const formData = new FormData()
			formData.append('image', dataUrlToBlob(dataUrl), 'chart.png')

			const response = await sendImage(formData)

			if (response?.status !== 200) {
				throw new Error('Ошибка при сохранении графика')
			} else {
				setSnackbarMessage('График успешно сохранен на сервере')
				setSnackbarSeverity('success')
			}
		} catch (error) {
			console.error('Ошибка при сохранении графика:', error)
			setSnackbarMessage('Не удалось сохранить график на сервере')
			setSnackbarSeverity('error')
		} finally {
			setIsSaving(false)
			setSnackbarOpen(true)
		}
	}

	const handleCloseSnackbar = () => {
		setSnackbarOpen(false)
	}

	if (columns.length === 0) {
		return (
			<Paper sx={{p: 2, textAlign: 'center'}}>
				<Typography>No data available or data is loading...</Typography>
			</Paper>
		)
	}

	return (

		<div>
			<div ref={chartRef}>
				<Box sx={{p: 2}}>
					<Paper sx={{p: 2, mb: 2}}>
						<Typography variant="h6" gutterBottom>
							Chart Configuration
						</Typography>
						<Box sx={{display: 'flex', gap: 2, flexWrap: 'wrap'}}>
							<FormControl sx={{minWidth: 120}}>
								<InputLabel>X-Axis</InputLabel>
								<Select label="X-Axis" value={xAxis} onChange={handleXAxisChange}>
									{columns.map((col) => (
										<MenuItem key={`x-${col}`} value={col}>
											{col}
										</MenuItem>
									))}
								</Select>
							</FormControl>

							<FormControl sx={{minWidth: 120}}>
								<InputLabel>Y-Axis</InputLabel>
								<Select label="Y-Axis" value={yAxis} onChange={handleYAxisChange}>
									{numericColumns.map((col) => (
										<MenuItem key={`y-${col}`} value={col}>
											{col}
										</MenuItem>
									))}
								</Select>
							</FormControl>

							<FormControl sx={{minWidth: 120}}>
								<InputLabel>Chart Type</InputLabel>
								<Select
									label="Chart Type"
									value={chartType}
									onChange={handleChartTypeChange}
								>
									<MenuItem value="bar">Bar Chart</MenuItem>
									<MenuItem value="line">Line Chart</MenuItem>
									<MenuItem value="scatter">Scatter Plot</MenuItem>
								</Select>
							</FormControl>
						</Box>

						{numericColumns.length === 0 && (
							<Alert severity="warning" sx={{mt: 2}}>
								No numeric columns found in the data. Line and scatter plots require numeric values.
							</Alert>
						)}
					</Paper>

					<Paper sx={{p: 2, height: '400px'}}>
						{xAxis && yAxis ? (
							processedData.length > 0 ? (
								renderChart()
							) : (
								<Typography sx={{textAlign: 'center', mt: 10}}>
									No valid numeric data available for selected Y-axis
								</Typography>
							)
						) : (
							<Typography sx={{textAlign: 'center', mt: 10}}>
								Please select X and Y axes to display the chart
							</Typography>
						)}
					</Paper>
				</Box>
			</div>

			<Button
				disabled={isSaving}
				sx={{mt: 2}}
				variant="contained"
				color="primary"
				onClick={saveChartToServer}
				startIcon={isSaving ? <CircularProgress size={20} /> : null}
			>
				{isSaving ? 'Сохранение...' : 'Сохранить график на сервере'}
			</Button>

			<Snackbar
				autoHideDuration={6000}
				onClose={handleCloseSnackbar}
				open={snackbarOpen}
			>
				<Alert
					severity={snackbarSeverity}
					sx={{width: '100%'}}
					onClose={handleCloseSnackbar}
				>
					{snackbarMessage}
				</Alert>
			</Snackbar>
		</div>
	)
}
