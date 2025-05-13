import express, {Request} from 'express'
import multer from 'multer'
import cors from 'cors'
import fs from 'fs'
import path from 'path'

const app = express()
const upload = multer({dest: 'uploads/'})
const saveDir = 'uploads/'

// Инициализация файла metadata
const initializeFiles = () => {
	if (!fs.existsSync(saveDir + 'files.json')) {
		fs.writeFileSync(saveDir + 'files.json', '[]', 'utf8')
	}
}
initializeFiles()

const getFileColumns = (filePath: string) => {
	try {
		const content = fs.readFileSync(filePath, 'utf8')
		return content.split('\n')[0].split(',')
	} catch {
		return []
	}
}

app.use(cors())
app.use(express.json())

// Создаем папку для загрузок если ее нет
if (!fs.existsSync('uploads')) {
	fs.mkdirSync('uploads')
}

app.post('/upload', upload.single('file'), (req: Request, res) => {
	try {
		if (!req?.file) {
			return res.status(400).json({error: 'No file uploaded'})
		}

		const newFile = {
			id: Date.now(),
			name: req.file.originalname,
			type: req.file.mimetype,
			path: req.file.path,
			date: new Date().toISOString()
		}

		const files = JSON.parse(fs.readFileSync(saveDir + 'files.json', 'utf8'))
		files.push(newFile)
		fs.writeFileSync(saveDir + 'files.json', JSON.stringify(files))

		res.status(201).json(newFile)
	} catch (error) {
		console.error('Upload error:', error)
		res.status(500).json({error: 'File upload failed'})
	}
})

// Получение списка файлов
app.get('/files', (req, res) => {
	try {
		const files = JSON.parse(fs.readFileSync(saveDir + 'files.json', 'utf8'))
			.map(file => ({
				...file,
				columns: getFileColumns(file.path)
			}))
		res.json(files)
	} catch (error) {
		res.status(500).json({error: 'Error reading files'})
	}
})

// Удаление файла
app.delete('/files/:id', (req, res) => {
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

// Получение содержимого файла
app.get('/file/:id', (req, res) => {
	const files = JSON.parse(fs.readFileSync(saveDir + 'files.json', 'utf8'))
	const file = files.find(f => f.id === parseInt(req.params.id))

	if (!file) return res.status(404).send('File not found')

	try {
		const content = fs.readFileSync(file.path, 'utf8')
		res.send(content)
	} catch (error) {
		res.status(500).send('Error reading file')
	}
})

// Сохранение обработанного датасета
app.post('/save-dataset', (req, res) => {
	try {
		const {name, content} = req.body
		const filename = `${Date.now()}_${name}`
		const filePath = path.join('uploads', filename)

		fs.writeFileSync(filePath, content, 'utf8')

		const newFile = {
			id: Date.now(),
			name: filename,
			path: filePath,
			date: new Date().toISOString()
		}

		const files = JSON.parse(fs.readFileSync(saveDir + 'files.json', 'utf8'))
		files.push(newFile)
		fs.writeFileSync(saveDir + 'files.json', JSON.stringify(files))

		res.status(201).json(newFile)
	} catch (error) {
		console.error('Save dataset error:', error)
		res.status(500).send('Error saving dataset')
	}
})

let charts = []
try {
	charts = JSON.parse(fs.readFileSync(saveDir + 'charts.json', 'utf8'))
} catch {
	fs.writeFileSync(saveDir + 'charts.json', '[]')
}

app.get('/charts', (req, res) => {
	try {
		const chartsData = fs.readFileSync(saveDir + 'charts.json', 'utf8')
		res.json(JSON.parse(chartsData))
	} catch (error) {
		res.status(500).json({error: 'Error reading charts'})
	}
})

app.post('/charts', (req, res) => {
	try {
		const charts = JSON.parse(fs.readFileSync(saveDir + 'charts.json', 'utf8'))
		const newChart = {
			id: Date.now(),
			...req.body
		}
		charts.push(newChart)
		fs.writeFileSync(saveDir + 'charts.json', JSON.stringify(charts))
		res.status(201).json(newChart)
	} catch (error) {
		res.status(500).json({error: 'Chart creation failed'})
	}
})

const PORT = 5001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
