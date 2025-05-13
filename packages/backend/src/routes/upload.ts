import express from 'express'
import multer from 'multer'


const UploadRouter = express.Router()
const upload = multer({dest: '../../' + saveDir})

UploadRouter.post('/upload', upload.single('avatar'), function (req: Request, res) {
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

export {UploadRouter}
