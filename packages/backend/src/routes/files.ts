import fs from 'fs'
import express from 'express'
import {getFileColumns} from 'src/utils/getFileColumns'
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

// Удаление файла
FilesRouter.delete('/files/:id', (req, res) => {
	try {
		const files = JSON.parse(fs.readFileSync(saveDir + 'files.json', 'utf8'))
		const file = files.find(f => f.id === parseInt(req.params.id))

		if (!file) return res.status(404).json({error: 'File not found'})

		fs.unlinkSync(file.path)

		const updatedFiles = files.filter(f => f.id !== parseInt(req.params.id))
		fs.writeFileSync(saveDir + 'files.json', JSON.stringify(updatedFiles))

		res.json({message: 'File deleted successfully'})
	} catch (error) {
		console.error('Delete error:', error)
		res.status(500).json({error: 'File deletion failed'})
	}
})

export {FilesRouter}
