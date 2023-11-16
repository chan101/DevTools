import React, { useState } from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogViewer from './components/LogViewer';
import DevServerApps from './components/DevServerApps';
import AppStatus from './components/AppStatus';
import Tools from './components/Tools';
import './css/App.css';

function App() {

  const [navShow, setNavShow] = useState(false);
  const [theme, setTheme] = useState(()=>{
    let localTheme = localStorage.getItem('theme')
    return (localTheme === null?true:localTheme==="dark");
  });

  const handleNavBar = () => {
    setNavShow(!navShow);
  }
  
  const handleThemeChange = () => {
    const newTheme = !theme;
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    setTheme(newTheme);
  }

  return (
    <Router>
      <Navbar navShow={navShow} handleNavBar={handleNavBar} theme={theme} changeTheme={handleThemeChange}/>
      <Routes>
        <Route path='/AppStatus' element={<AppStatus theme={theme}/>} />
        <Route path='/logviewer' element={<LogViewer theme={theme}/>} />
        <Route path='/DevServerApps' element={<DevServerApps theme={theme}/>} />
        <Route path='/Tools' element={<Tools theme={theme}/>} />
        <Route path='/' element={<AppStatus theme={theme}/>} />
      </Routes>
    </Router>
  );
}

export default App;
