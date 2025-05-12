import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Connections.css';

const Connections = () => {
  const [files, setFiles] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const fileInputRef = useRef(null);

  const loadFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/files');
      setFiles(response.data);
    } catch (error) {
      console.error('Error loading files:', error);
      alert('Ошибка загрузки списка файлов');
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleFileUpload = async (e) => {
    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    try {
      await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await loadFiles();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Ошибка загрузки файла');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/files/${id}`);
      setFiles(prev => prev.filter(f => f.id !== id));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Ошибка удаления файла');
    }
  };

  const filteredFiles = files
    .filter(f => f.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => sortOrder === 'newest' 
      ? new Date(b.date) - new Date(a.date) 
      : new Date(a.date) - new Date(b.date));

  return (
    <div className="connections-page">
      <div className="connections-header">
        <h1>Подключения</h1>
        <div className="controls">
          <input
            type="text"
            placeholder="Фильтр по имени"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          
          <div className="sort-buttons">
            <button
              className={sortOrder === 'newest' ? 'active' : ''}
              onClick={() => setSortOrder('newest')}
            >
              Сначала новые
            </button>
            <button
              className={sortOrder === 'oldest' ? 'active' : ''}
              onClick={() => setSortOrder('oldest')}
            >
              Сначала старые
            </button>
          </div>

          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <button 
            className="create-btn"
            onClick={() => fileInputRef.current.click()}
          >
            Создать подключение
          </button>
        </div>
      </div>

      {filteredFiles.length > 0 ? (
        <table className="connections-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Дата добавления</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles.map(file => (
              <tr key={file.id}>
                <td>{file.name}</td>
                <td>{new Date(file.date).toLocaleDateString('ru-RU')}</td>
                <td>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(file.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">
          Нет подключенных файлов
        </div>
      )}
    </div>
  );
};

export default Connections;