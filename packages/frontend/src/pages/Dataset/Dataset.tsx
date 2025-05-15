import type { SelectChangeEvent} from '@mui/material';

import {MenuItem, Select} from '@mui/material'
import {useEffect, useState} from 'react'

import type {IFile} from '../../types/IFiles'

import {getFile, getFilesList} from '../../api/files'

const CreateDataset = () => {
	const [fileName, setFileName] = useState<string>('')
	const [filesList, setFilesList] = useState<string[]>([])
	const [files, setFiles] = useState<IFile[]>([])

	const columns = Object.keys(files[0] ?? {});

	useEffect(() => {
		if (!fileName) return

		getFile(fileName).then(data => {
			console.log(data)
			if (!data) return console.log('Файлов нет')

			setFiles(data.data)
		})
	}, [fileName])

	useEffect(() => {
		getFilesList().then(data => {
			if (!data) return console.log('Файлов нет!')

			setFilesList(data.data)
		})
	}, [])

	const handleChange = (event: SelectChangeEvent) => {
		setFileName(event.target.value as string)
	}

	return (
		<div className="connections-page">
			<div className="connections-header">
				<h1>Выбор файла для просмотра</h1>
				<div className="controls">
					<Select
						id="demo-simple-select"
						label="Age"
						labelId="demo-simple-select-label"
						sx={{minWidth: '250px'}}
						value={fileName}
						onChange={handleChange}
					>
						{filesList.map(fileName => {
							return <MenuItem key={fileName} value={fileName}>{fileName}</MenuItem>
						})}
					</Select>
				</div>
			</div>

			{files.length && (
				<table className="connections-table">
					<thead>
						<tr>
							{columns.map(column => {
								return <th key={column}>{column}</th>
							})}
						</tr>
					</thead>
					<tbody>
						{files.map((file, index) => (
							<tr key={index}>
								{Object.values(file).map((value, index) => {
									return <td key={index}>{value}</td>
								})}
							</tr>
						))}
					</tbody>
				</table>
			)}
			{!files.length && (
				<div className="empty-state">
					Нет подключенных файлов
				</div>
			)}
		</div>
	)
}

export default CreateDataset
