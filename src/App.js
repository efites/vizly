import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useState } from 'react';
import Home from './components/Home';
import Connections from './components/Connections';
import CreateDataset from './components/CreateDataset';
import CreateChart from './components/CreateChart';
import './App.css';

const UploadFile = () => <div className="page-content">Подключение файла</div>;
const Dashboards = () => <div className="page-content">Дашборды</div>;

const Menu = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <nav className={`main-menu ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="menu-header">{!isCollapsed && 'Vizly'}
        <button 
          className="toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>
        
      <ul>
        <li>
          <Link to="/">{!isCollapsed && 'Главная'}</Link></li>
        <li><Link to="/upload">{!isCollapsed && 'Подключить файл'}</Link></li>
        <li><Link to="/dataset">{!isCollapsed && 'Создать датасет'}</Link></li>
        <li><Link to="/chart">{!isCollapsed && 'Создать чарт'}</Link></li>
        <li><Link to="/dashboards">{!isCollapsed && 'Дашборды'}</Link></li>
      </ul>
    </nav>
  );
};

function App() {
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

export default App;
