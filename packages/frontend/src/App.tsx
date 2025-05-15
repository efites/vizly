import {Route, BrowserRouter as Router, Routes} from 'react-router-dom'

import Connections from './components/Connections'
import Home from './components/Home'
import {Menu} from './components/Menu/Menu'
import {ChartProvider} from './context/ChartContext'
import {Chart} from './pages/Chart/Chart'
import {Dashboard} from './pages/Dashboard/Dashboard'
import CreateDataset from './pages/Dataset/Dataset'

import './App.css'

export const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Menu />
        <div className="content-container">
          <ChartProvider>
            <Routes>
              <Route element={<Home />} path="/" />
              <Route element={<Connections />} path="/upload" />
              <Route element={<CreateDataset />} path="/dataset" />
              <Route element={<Chart />} path="/chart" />
              <Route element={<Dashboard />} path="/dashboards" />
            </Routes>
          </ChartProvider>
        </div>
      </div>
    </Router>
  )
}
