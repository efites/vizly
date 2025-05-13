import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import './CreateDataset.css';

const CreateDataset = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [data, setData] = useState([]);
  const [parserConfig, setParserConfig] = useState({
    delimiter: ',',
    encoding: 'UTF-8',
    showEmpty: false
  });
  const fileInputRef = useRef(null);

  // Загрузка списка файлов
  useEffect(() => {
    const loadFiles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/files');
        setFiles(response.data);
      } catch (error) {
        console.error('Error loading files:', error);
        alert('Ошибка загрузки списка файлов');
      }
    };
    loadFiles();
  }, []);

  // Загрузка и парсинг файла
  const loadFileContent = async (fileId) => {
    try {
      const response = await axios.get(`http://localhost:5000/file/${fileId}`);
      const content = response.data;

      Papa.parse(content, {
  delimiter: parserConfig.delimiter,
  encoding: parserConfig.encoding,
  complete: (result) => {
    setData(
      result.data.map((row, index) => ({
        id: index,
        ...row,
        __empty: Object.values(row).some(v => v === '')
      })) // ← Правильное закрытие
    );
  },
  error: (error) => {
    console.error('Parsing error:', error);
    alert('Ошибка чтения файла! Проверьте разделитель и кодировку');
  }
});
    } catch (error) {
      console.error('File load error:', error);
      alert('Ошибка загрузки файла');
    }
  };

  // Обработчики действий
   const handleRemoveEmpty = () => {
    setData(prev => prev.filter(row => !row.__empty));
  };

  const handleShowEmpty = () => {
    const firstEmpty = data.findIndex(row => row.__empty);
    if (firstEmpty > -1) {
      const element = document.querySelector(`tr[data-rowid="${firstEmpty}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleSave = async () => {
    if (!selectedFile) {
      alert('Выберите файл перед сохранением');
      return;
    }

    const csv = Papa.unparse(data, {
      delimiter: parserConfig.delimiter
    });

    try {
      await axios.post('http://localhost:5000/save-dataset', {
        name: `processed_${selectedFile.name}`,
        content: csv
      });
      alert('Файл успешно сохранен!');
    } catch (error) {
      console.error('Save error:', error);
      alert('Ошибка сохранения файла');
    }
  };

  return (
    <div className="dataset-page">
      <div className="file-selector">
        <h2>Выберите файл:</h2>
        <select 
          onChange={(e) => {
            const file = files.find(f => f.id === parseInt(e.target.value));
            if (file) {
              setSelectedFile(file);
              loadFileContent(file.id);
            }
          }}
          value={selectedFile?.id || ''}
        >
          <option value="">Выберите файл</option>
          {files.map(file => (
            <option key={file.id} value={file.id}>
              {decodeURIComponent(file.name)} ({new Date(file.date).toLocaleDateString()})
            </option>
          ))}
        </select>
      </div>

      {selectedFile && (
        <div className="parser-config">
          <label>
            Разделитель:
            <select
              value={parserConfig.delimiter}
              onChange={(e) => setParserConfig(prev => ({
                ...prev, 
                delimiter: e.target.value
              }))}
            >
              <option value=",">Запятая (,)</option>
              <option value=";">Точка с запятой (;)</option>
              <option value="\t">Табуляция</option>
            </select>
          </label>

          <label>
            Кодировка:
            <select
              value={parserConfig.encoding}
              onChange={(e) => setParserConfig(prev => ({
                ...prev, 
                encoding: e.target.value
              }))}
            >
              <option value="UTF-8">UTF-8</option>
              <option value="Windows-1251">Windows-1251</option>
              <option value="ISO-8859-1">ISO-8859-1</option>
            </select>
          </label>
        </div>
      )}

      {data.length > 0 ? (
        <div className="data-section">
          <div className="controls">
            <button onClick={handleRemoveEmpty}>
              Удалить строки с пустыми значениями
            </button>
            <button onClick={handleShowEmpty}>
              Показать пустые значения
            </button>
            <button onClick={handleSave}>
              Сохранить датасет
            </button>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  {Object.keys(data[0])
                    .filter(k => k !== 'id' && k !== '__empty')
                    .map((header, index) => (
                      <th key={header}>{header}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr 
                    key={row.id}
                    data-rowid={index}
                    className={row.__empty ? 'empty-row' : ''}
                  >
                    {Object.entries(row)
                      .filter(([k]) => k !== 'id' && k !== '__empty')
                      .map(([key, value], i) => (
                        <td key={`${row.id}-${key}`}>
                          <input
                            value={value}
                            onChange={(e) => {
                              const newData = [...data];
                              newData[index][key] = e.target.value;
                              setData(newData);
                            }}
                          />
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          {selectedFile ? 'Файл не содержит данных' : 'Выберите файл для просмотра'}
        </div>
      )}
    </div>
  );
};

export default CreateDataset;