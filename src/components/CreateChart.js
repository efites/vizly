import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Modal, Select, Button } from '@mui/material';
import './CreateChart.css';

const CreateChart = () => {
  const [files, setFiles] = useState([]);
  const [charts, setCharts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [config, setConfig] = useState({
    name: '',
    type: 'line',
    fileId: null,
    xAxis: '',
    yAxis: ''
  });

  useEffect(() => {
    const loadData = async () => {
  const [filesRes, chartsRes] = await Promise.all([
    axios.get('http://localhost:5000/files'),
    axios.get('http://localhost:5000/charts')
  ]);
  setFiles(filesRes.data);
  setCharts(chartsRes.data);
};
    loadData();
  }, []);

  const createChart = async () => {
  const response = await axios.post(
    'http://localhost:5000/charts', 
    config
  );
};

  const selectedFile = files.find(f => f.id === config.fileId);

  return (
    <div className="charts-page">
      <div className="header">
        <h1>Мои графики</h1>
        <Button variant="contained" onClick={() => setIsModalOpen(true)}>
          Новый график
        </Button>
      </div>

      <div className="charts-grid">
        {charts.map(chart => (
          <div key={chart.id} className="chart-card">
            <ChartPreview chart={chart} files={files} />
          </div>
        ))}
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="chart-modal">
          <h2>Создание графика</h2>
          
          <Select
            label="Файл данных"
            options={files.map(f => ({ value: f.id, label: f.name }))}
            onChange={e => setConfig({ ...config, fileId: e.target.value })}
          />

          <Select
            label="Тип графика"
            options={[
              { value: 'line', label: 'Линейный' },
              { value: 'bar', label: 'Столбчатый' },
              { value: 'pie', label: 'Круговая' }
            ]}
            onChange={e => setConfig({ ...config, type: e.target.value })}
          />

          {selectedFile && (
            <>
              <Select
                label="Ось X"
                options={selectedFile.columns.map(c => ({ value: c, label: c }))}
                onChange={e => setConfig({ ...config, xAxis: e.target.value })}
              />

              <Select
                label="Ось Y"
                options={selectedFile.columns.map(c => ({ value: c, label: c }))}
                onChange={e => setConfig({ ...config, yAxis: e.target.value })}
              />
            </>
          )}

          <Button 
            variant="contained" 
            onClick={createChart}
            disabled={!config.fileId || !config.yAxis}
          >
            Сохранить
          </Button>
        </div>
      </Modal>
    </div>
  );
};

const ChartPreview = ({ chart, files }) => {
  const file = files.find(f => f.id === chart.fileId);
  const data = {
    labels: file?.data?.map(row => row[chart.xAxis]),
    datasets: [{
      label: chart.yAxis,
      data: file?.data?.map(row => row[chart.yAxis]),
      backgroundColor: '#2196f3'
    }]
  };

  return (
    <>
      {chart.type === 'line' && <Line data={data} />}
      {chart.type === 'bar' && <Bar data={data} />}
      {chart.type === 'pie' && <Pie data={data} />}
    </>
  );
};

export default CreateChart;