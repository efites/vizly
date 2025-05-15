import fs from 'fs'
import express from 'express'
import path from 'path'
import {parseCsvToJson} from 'src/utils/parseCsvToJson'


const FilesRouter = express.Router()

// Получение списка файлов
FilesRouter.get('/', async (request, response) => {
	try {
		const result = await parseCsvToJson(path.resolve('./uploads/exel.csv'))

		response.json(result)
	} catch (error) {
		response.status(500).json({error: 'Error reading files'})
	}
})

// Получение списка файлов
FilesRouter.get('/all/:filename', async (request, response) => {
	try {
		const filename = request.params.filename
		const result = await parseCsvToJson(path.resolve('./uploads/' + filename))

		response.json(result)
	} catch (error) {
		response.status(500).json({error: 'Error reading files'})
	}
})

FilesRouter.delete('/all/:filename', async (request, response) => {
	try {
		const filename = request.params.filename

		fs.unlink(path.resolve('./uploads/' + filename), err => {
			if (err) throw err // не удалось удалить файл
			console.log('Файл успешно удалён')
		})

		response.json({message: 'Файл успешно удален'})
	} catch (error) {
		response.status(500).json({error: 'Error reading files'})
	}
})

FilesRouter.get('/all', async (request, response) => {
	try {
		const chartsDir = path.join(path.resolve(), 'uploads')
		const files = await fs.promises.readdir(chartsDir)

		const fileStats = await Promise.all(
			files.map(file => fs.promises.stat(path.join(chartsDir, file)))
		)

		const fileNames = files.filter((file, index) => fileStats[index].isFile())

		return response.json(fileNames)
	} catch (error) {
		return {
			error: error
		}
	}
})

export {FilesRouter}
