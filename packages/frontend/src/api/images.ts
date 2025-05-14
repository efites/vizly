import {api} from './api'


interface ISendImage {
	fileName: string
	message: string
	path: string
	success: boolean
}

const sendImage = async (dataUrl: FormData) => {
	try {
		const response = await api.post<ISendImage>('/images', dataUrl)

		return response
	} catch (error) {
		console.error('Error loading files:', error)
	}
}

export {sendImage}
