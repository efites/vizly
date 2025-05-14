import express, {Request} from 'express'
import multer from 'multer'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import {router} from './routes/routes'


export const saveDir = 'uploads/'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/', router)
app.use(express.static('charts'))

// Инициализация файла metadata
const initializeFiles = () => {
	if (!fs.existsSync(saveDir + 'files.json')) {
		fs.writeFileSync(saveDir + 'files.json', '[]', 'utf8')
	}
}
initializeFiles()

// Создаем папку для загрузок если ее нет
if (!fs.existsSync('uploads')) {
	fs.mkdirSync('uploads')
}


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

const PORT = process.env.SERVER_PORT || 5001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
