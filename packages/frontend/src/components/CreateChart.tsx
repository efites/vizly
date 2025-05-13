import { Button, Modal, Select } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';

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
    axios.get(import.meta.env.PUBLIC_BACKEND_URL + '/files'),
    axios.get(import.meta.env.PUBLIC_BACKEND_URL + '/charts')
  ]);
  setFiles(filesRes.data);
  setCharts(chartsRes.data);
};
    loadData();
  }, []);

  const createChart = async () => {
  const response = await axios.post(
    import.meta.env.PUBLIC_BACKEND_URL + '/charts',
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

      <Modal onClose={() => setIsModalOpen(false)} open={isModalOpen}>
        <div className="chart-modal">
          <h2>Создание графика</h2>

          <Select
            label="Файл данных"
            onChange={e => setConfig({ ...config, fileId: e.target.value })}
            options={files.map(f => ({ value: f.id, label: f.name }))}
          />

          <Select
            label="Тип графика"
            onChange={e => setConfig({ ...config, type: e.target.value })}
            options={[
              { value: 'line', label: 'Линейный' },
              { value: 'bar', label: 'Столбчатый' },
              { value: 'pie', label: 'Круговая' }
            ]}
          />

          {selectedFile && (
            <>
              <Select
                label="Ось X"
                onChange={e => setConfig({ ...config, xAxis: e.target.value })}
                options={selectedFile.columns.map(c => ({ value: c, label: c }))}
              />

              <Select
                label="Ось Y"
                onChange={e => setConfig({ ...config, yAxis: e.target.value })}
                options={selectedFile.columns.map(c => ({ value: c, label: c }))}
              />
            </>
          )}

          <Button
            disabled={!config.fileId || !config.yAxis}
            variant="contained"
            onClick={createChart}
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
