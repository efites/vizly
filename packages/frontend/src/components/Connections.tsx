import {useEffect, useRef, useState} from 'react'

import type {IFile} from '../types/IFiles'

import {getFiles, sendFile} from '../api/files'

import './Connections.css'


const Connections = () => {
  const [files, setFiles] = useState<IFile[]>([])
  const [filter, setFilter] = useState('')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const fileInputRef = useRef(null)

  const columns = Object.keys(files.at(0) ?? [])

  useEffect(() => {
    getFiles().then(data => {
      console.log(data)
      if (!data) return console.log('Файлов нет')

      setFiles(data.data)
    })
  }, [])

  const loadFileHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const form = new FormData()

    if (!event.target.files?.length) return

    form.append('file', event.target.files[0])

    const result = await sendFile(form)
    console.log(result)
  }

  // const handleDelete = async (id) => {
  //   try {
  //     await axios.delete(`${import.meta.env.PUBLIC_BACKEND_URL}/files/${id}`)
  //     setFiles(prev => prev.filter(f => f.id !== id))
  //   } catch (error) {
  //     console.error('Delete error:', error)
  //     alert('Ошибка удаления файла')
  //   }
  // }

  return (
    <div className="connections-page">
      <div className="connections-header">
        <h1>Подключения</h1>
        <div className="controls">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Фильтр по имени"
          />

          <div className="sort-buttons">
            <button
              className={sortOrder === 'newest' ? 'active' : ''}
              type='button'
              onClick={() => setSortOrder('newest')}
            >
              Сначала новые
            </button>
            <button
              className={sortOrder === 'oldest' ? 'active' : ''}
              type='button'
              onClick={() => setSortOrder('oldest')}
            >
              Сначала старые
            </button>
          </div>

          <input
            ref={fileInputRef}
            accept=".xlsx,.xls,.csv"
            style={{display: 'none'}}
            type="file"
            onChange={loadFileHandler}
          />
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

export default Connections
