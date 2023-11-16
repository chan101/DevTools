import React from "react";
import { useLocation } from "react-router-dom";
import { TfiAngleDoubleLeft, TfiAngleDoubleRight } from 'react-icons/tfi'
import { BsFillMoonFill, BsSun } from 'react-icons/bs';
import { Nav } from 'react-bootstrap';
const Navbar = (props) => {

	const location = useLocation();

	return (
		<>
			<div className={props.navShow ? 'shadow_menu active' : 'shadow_menu'} onClick={props.handleNavBar}></div>
			<button className='sidebarButton' onClick={props.handleNavBar} style={{ left: props.navShow ? '206px' : '2px' }}>
				{props.navShow ?
					<TfiAngleDoubleLeft size="30px" /> : <TfiAngleDoubleRight size="30px" />} {props.navShow ? "" : 'Menu'}
			</button>
			<Nav id='sidebar' variant="pills" defaultActiveKey="/AppStatus" className="flex-column"
				style={{ left: props.navShow ? '2px' : '-206px' }}>
				<Nav.Link href="/AppStatus" active={location.pathname === "/AppStatus"}>App Status</Nav.Link>
				<Nav.Link href="/LogViewer" active={location.pathname === "/LogViewer"}>Log Viewer</Nav.Link>
				<Nav.Link href="/DevServerApps" active={location.pathname === "/DevServerApps"}>Dev Server Apps</Nav.Link>
				<Nav.Link href="/Tools" active={location.pathname === "/Tools"}>Tools</Nav.Link>
				<div className="theme">
					<button onClick={props.changeTheme}>{!props.theme ? <BsFillMoonFill size="45px" style={{ color: 'black' }} /> : <BsSun size="45px" />}</button>
				</div>
			</Nav>
		</>
	);
};

export default Navbar;
