import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useState } from 'react';
import {Link} from 'react-router-dom'


export const Menu = () => {
	const [isCollapsed, setIsCollapsed] = useState(false)

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
	)
}
