import {Route, BrowserRouter as Router, Routes} from 'react-router-dom'

import Connections from './components/Connections'
import Home from './components/Home'
import {Menu} from './components/Menu/Menu'
import {Chart} from './pages/Chart/Chart'
import CreateDataset from './pages/Dataset/Dataset'

import './App.css'

const UploadFile = () => <div className="page-content">Подключение файла</div>;
const Dashboards = () => <div className="page-content">Дашборды</div>;

export const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Menu />
        <div className="content-container">
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<Connections />} path="/upload" />
            <Route element={<UploadFile />} path="/upload" />
            <Route element={<CreateDataset />} path="/dataset" />
            <Route element={<Chart />} path="/chart" />
            <Route element={<Dashboards />} path="/dashboards" />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
