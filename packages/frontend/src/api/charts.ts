import {api} from './api'


interface IImage {
	charts: IChart[]
	count: number
	success: boolean
}

export interface IChart {
	created_at: Date
	download_url: string
	filename: string
	height: number
	modified_at: Date
	size: number
	width: number
}

const getChartImages = async () => {
	try {
		const response = await api.get<IImage>('/charts')

		return response
	} catch (error) {
		console.error('Error loading files:', error)
	}
}

export {getChartImages}
