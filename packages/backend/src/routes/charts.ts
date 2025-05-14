import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import {isImageFile} from 'src/utils/isImageFile'


const ChartsRouter = express.Router()

// Получение списка файлов
ChartsRouter.get('/', async (request, response) => {
	try {
		const chartsDir = path.join(path.resolve(), 'charts')

		// Создаем папку, если не существует
		await fs.mkdir(chartsDir, {recursive: true})

		const files = await fs.readdir(chartsDir)

		const chartFiles = await Promise.all(
			files.map(async (filename) => {
				try {
					const filePath = path.join(chartsDir, filename)
					const stats = await fs.stat(filePath)

					// Пропускаем директории и не-изображения
					if (stats.isDirectory() || !(await isImageFile(filePath))) {
						return null
					}

					// Получаем размеры изображения
					const buffer = await fs.readFile(filePath)
					const {width, height} = await sharp(buffer).metadata()

					return {
						filename,
						size: stats.size,
						created_at: stats.birthtime.toISOString(),
						modified_at: stats.mtime.toISOString(),
						download_url: `http://localhost:${process.env.SERVER_PORT}/${filename}`,
						width: width || 0,
						height: height || 0
					}
				} catch (error) {
					console.error(`Error processing file ${filename}:`, error)
					return null
				}
			})
		)

		// Фильтруем null и сортируем
		const validFiles = chartFiles
			.filter(file => file !== null)
			.sort((a, b) =>
				new Date(b!.modified_at).getTime() - new Date(a!.modified_at).getTime()
			)

		response.json({
			success: true,
			count: validFiles.length,
			charts: validFiles
		})

	} catch (error) {
		console.error('Error reading charts directory:', error)
		response.status(500).json({
			success: false,
			error: 'Could not read charts directory',
			details: error instanceof Error ? error.message : String(error)
		})
	}
})

// Добавьте этот маршрут после основного GET-маршрута
ChartsRouter.get('/download/:filename', async (request, response) => {
	try {
		const {filename} = request.params
		const chartsDir = path.join(path.resolve(), 'charts')
		const filePath = path.join(chartsDir, filename)

		// Проверяем существование файла
		await fs.access(filePath)

		// Отправляем файл
		response.download(filePath, filename)

	} catch (error) {
		console.error('Error downloading chart:', error)
		response.status(404).json({
			success: false,
			error: 'File not found'
		})
	}
})

export {ChartsRouter}
