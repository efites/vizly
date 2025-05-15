import fs from 'fs'
import express from 'express'
import path from 'path'
import {parseCsvToJson} from 'src/utils/parseCsvToJson'
import multer from 'multer'


const FilesRouter = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Получение списка файлов
FilesRouter.get('/', async (request, response) => {
	try {
		const result = await parseCsvToJson(path.resolve('./uploads/exel.csv'))

		response.json(result)
	} catch (error) {
		response.status(500).json({error: 'Error reading files'})
	}
})

FilesRouter.post('/all', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  res.json({
    success: true,
    message: 'File uploaded successfully',
    filename: req.file.filename
  });
});

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
