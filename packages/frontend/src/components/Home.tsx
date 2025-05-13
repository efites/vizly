import { 
  BarChart, 
  CloudUpload, 
  DashboardCustomize, 
  DataArray
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

import './Home.css';

const Home = () => {
    const cards = [
    { title: "Подключить файл", description: "Загрузите данные из CSV, Excel или других поддерживаемых форматов",  icon: <CloudUpload />, path: "/upload", color: "#2ecc71" },
    { title: "Создать датасет", description: "Обработайте и подготовьте данные для анализа", icon: <DataArray />, path: "/dataset", color: "#3498db" },
    { title: "Создать чарт", description: "Визуализируйте данные с помощью различных типов графиков",  icon: <BarChart />, path: "/chart", color: "#9b59b6" },
    { title: "Дашборды",  description: "Собирайте и настраивайте интерактивные панели мониторинга",  icon: <DashboardCustomize />, path: "/dashboards", color: "#e67e22" }
  ];

  return (
    <div className="home-page">
      {/* Добавляем хэдер */}
      <header className="main-header">
        <h1>Добро пожаловать в Vizly</h1>
        <p>Наше приложение делает анализ и визуализацию доступными даже для новичков. Интуитивный интерфейс, автоматическая аналитика и готовые шаблоны графиков помогут вам за секунды увидеть то, что скрыто в цифрах.</p>
      </header>

    <div className="home-container">
      {cards.map((card, index) => (
        <Link key={index} className="nav-card" style={{ borderTop: `4px solid ${card.color}` }} to={card.path}>
          <div className="card-icon" style={{ color: card.color }}>{card.icon}</div>
          <h3>{card.title}</h3>
          <p className="card-description">{card.description}</p>
        </Link>
      ))}
    </div>
    </div>
  );
};

export default Home;