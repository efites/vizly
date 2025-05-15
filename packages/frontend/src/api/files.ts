import type {IFile} from '../types/IFiles'

import {api} from './api'


const getFilesList = async () => {
	try {
		const response = await api.get<string[]>('/files/all')

		if (!response.data) return

		return response
	} catch (error) {
		console.error('Error loading files:', error)
	}
}

const getFiles = async () => {
	try {
		const response = await api.get<IFile[]>('/files')

		if (!response.data) return

		return response
	} catch (error) {
		console.error('Error loading files:', error)
	}
}

const getFile = async (filename: string) => {
	try {
		const response = await api.get<IFile[]>(`/files/all/${filename}`)

		if (!response.data) return

		return response
	} catch (error) {
		console.error('Error loading files:', error)
	}
}

const deleteFile = async (filename: string) => {
	try {
		console.log(`/files/all/${filename}`)
		const response = await api.delete<{message: string}>(`/files/all/${filename}`)

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

export {deleteFile, getFile, getFiles, getFilesList, sendFile}
