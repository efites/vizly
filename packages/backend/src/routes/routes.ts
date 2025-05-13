import express from 'express'
//import {UploadRouter} from './upload'
import {FilesRouter} from './files'


const router = express.Router()

//router.use('/upload', UploadRouter)
router.use('/files', FilesRouter)

export {router}
