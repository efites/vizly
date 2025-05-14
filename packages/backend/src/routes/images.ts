import fs from 'fs'
import express from 'express'
import path from 'path'
import multer from 'multer'


const ImagesRouter = express.Router()

const upload = multer({
	storage: multer.memoryStorage(), // Хранение в памяти (можно изменить на diskStorage)
	limits: {
		fileSize: 50 * 1024 * 1024 // 50MB лимит
	},

})

// Получение списка файлов
ImagesRouter.post('/', upload.single('image'), async (request, response) => {
	try {
		if (!request.file) {
			return response.status(400).json({error: 'No image provided'})
		}
		// Получаем данные из FormData
		const chartName = request.body.chartName || 'unnamed_chart'
		const fileBuffer = request.file.buffer

		// Создаем папку для сохранения, если её нет
		const uploadDir = path.join(path.resolve(), 'charts')
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, {recursive: true})
		}

		// Генерируем имя файла
		const fileName = `${chartName}_${Date.now()}.png`
		const filePath = path.join(uploadDir, fileName)

		// Сохраняем файл
		fs.writeFileSync(filePath, fileBuffer)

		// Отправляем ответ
		response.json({
			success: true,
			message: 'Chart saved successfully',
			path: filePath,
			fileName: fileName
		})
	} catch (error) {
		console.error('Error saving chart:', error)
		response.status(500).json({error: 'Failed to save chart'})
	}
})

export {ImagesRouter}
