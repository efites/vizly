import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Connections from './components/Connections'
import CreateDataset from './components/CreateDataset'
import CreateChart from './components/CreateChart'
import Home from './components/Home'
import './App.css';
import {Menu} from './components/Menu/Menu'

const UploadFile = () => <div className="page-content">Подключение файла</div>;
const Dashboards = () => <div className="page-content">Дашборды</div>;

export const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Menu />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Connections />} />
            <Route path="/upload" element={<UploadFile />} />
            <Route path="/dataset" element={<CreateDataset />} />
            <Route path="/chart" element={<CreateChart />} />
            <Route path="/dashboards" element={<Dashboards />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
