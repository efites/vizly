import type {
	SelectChangeEvent} from '@mui/material';

import {
	Alert,
	Box,
	FormControl,
	InputLabel,
	MenuItem,
	Paper,
	Select,
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
import React, {useEffect, useMemo, useState} from 'react'
import {Bar, Line, Scatter} from 'react-chartjs-2'

import type {IFile} from '../../types/IFiles'

import {getFiles} from '../../api/files'

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

	if (columns.length === 0) {
		return (
			<Paper sx={{p: 2, textAlign: 'center'}}>
				<Typography>No data available or data is loading...</Typography>
			</Paper>
		)
	}

	return (
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
	)
}
