
import type {SnackbarCloseReason} from '@mui/material'

import {Box, Button, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from '@mui/material'
import {useEffect, useState} from 'react'

import {deleteFile, getFilesList, uploadFile} from '../api/files'

import './Connections.css'


const Connections = () => {
  const [filesList, setFilesList] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)

  useEffect(() => {
    getFilesList().then(data => {
      if (!data) return console.log('Файлов нет!')

      setFilesList(data.data)
    })
  }, [open])

  const handleClose = (
    event: Event | React.SyntheticEvent,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  const handleDelete = async (filename: string) => {
    setOpen(true)

    const response = await deleteFile(filename)
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      setIsUploading(true)

      const response = await uploadFile(formData)
      setOpen(true)
      setFile(null)
    } catch (error) {
      console.error('Error uploading file:', error)
      setUploadResult({success: false, message: 'Upload failed'})
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <>
      <TableContainer sx={{maxWidth: '70%', margin: '0 auto'}} component={Paper}>
        <Snackbar
          message={"Успешно"}
          anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
          autoHideDuration={6000}
          onClose={handleClose}
          open={open}
        />
        <Table aria-label="simple table" sx={{minWidth: 650}}>
          <TableHead>
            <TableRow>
              <TableCell><Typography variant='h6' fontWeight={'bold'}>File name</Typography></TableCell>
              <TableCell align="right"><Typography variant='h6' fontWeight={'bold'}>Actions</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filesList.map((row) => (
              <TableRow
                key={row}
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
              >
                <TableCell component="th" scope="row">
                  {row}
                </TableCell>
                <TableCell align="right">
                  <Button type='button' variant="contained" color="error" onClick={() => handleDelete(row)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{mb: 2, display: 'flex', justifyContent: 'space-between', gap: '30px', maxWidth: '70%', margin: '0 auto', mt: '40px'}}>
        <Button
          variant="contained"
          component="label"
        >
          Choose File
          <input
            hidden
            type="file"
            onChange={handleFileChange}
          />
        </Button>
        {file && <Typography sx={{mt: 1}}>Selected: {file.name}</Typography>}
        <Button
          disabled={!file || isUploading}
          variant="contained"
          color="primary"
          onClick={handleUpload}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      </Box>
    </>
  )
}

export default Connections
