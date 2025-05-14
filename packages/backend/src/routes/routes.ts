import express from 'express'
//import {UploadRouter} from './upload'
import {FilesRouter} from './files'
import {ImagesRouter} from './images'
import {ChartsRouter} from './charts'


const router = express.Router()

//router.use('/upload', UploadRouter)
router.use('/files', FilesRouter)
router.use('/images', ImagesRouter)
router.use('/charts', ChartsRouter)

export {router}
