import type {IFile} from '../types/IFiles'

import {api} from './api'


const getFiles = async () => {
	try {
		const response = await api.get<IFile[]>('/files')

		if (!response.data) return

		return response
	} catch (error) {
		console.error('Error loading files:', error)
	}
}

const sendFile = async (file: FormData) => {
	try {
		const response = await api.post('/files', file)

		return response
	} catch (error) {
		console.error('Error loading files:', error)
	}
}

export {getFiles, sendFile}
