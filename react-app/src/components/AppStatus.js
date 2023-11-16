import React, { useState, useEffect } from "react";


import Table from 'react-bootstrap/Table';
import { Button, Form } from 'react-bootstrap';
import { IoMdRefresh } from 'react-icons/io';
import { FaCog } from 'react-icons/fa';
import '../css/App.css';

const AppStatus = (props) => {
    
    const [statuses, setStatuses] = useState({});
    const [appPorts, setAppPorts] = useState();
    const [refresh, setRefresh] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [refreshInterval, setRefreshInterval] = useState(()=>{
        return localStorage.getItem('refreshInterval') === null ? '60':localStorage.getItem('refreshInterval');
      });
    const [onlineStatus,setOnlineStatus] = useState({});

    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setRefresh((prevRefresh) => !prevRefresh);
            setOnlineStatus({});
        }, parseInt(refreshInterval+"000"));
        setOnlineStatus({});
        return () => clearInterval(interval);
    }, [refresh]);


    useEffect(() => {
        fetch("http://localhost:8080/api/fetch_app_urls", {
            header: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        })
            .then((response) => response.json())
            .then((appPorts) => {
                setAppPorts(appPorts);
                appPorts.forEach((app) => {
                    checkStatus(`${app.urls.FRONTEND_APPLICATION}`, `${app.urls.FRONTEND_APPLICATION}`, app.name, 'FRONTEND_APPLICATION');
                    checkStatus(`${app.urls.BACKEND_APPLICATION}`, `${app.urls.BACKEND_APPLICATION}`, app.name, 'BACKEND_APPLICATION');
                    checkStatus(`${app.urls.REST_API1}`, `${app.urls.REST_API1}`, app.name, 'REST_API1 REST');
                    checkStatus(`${app.urls.REST_API2}`, `${app.urls.REST_API2}`, app.name, 'REST_API2 REST');
                });
            });
    }, [refresh]);

    const checkStatus = (url, appIPasID, appRegion, app) => {
        
        fetch(`http://localhost:8080/proxy?url=${url}`)
            .then((response) => {
                const appStatus = response.status === 200 ? "Online" : "Offline";
                console.log(appStatus);
                setStatuses((prevStatuses) => ({
                    ...prevStatuses,
                    [appIPasID]: appStatus,
                }));

                if (appStatus === "Offline") {
                    const notify = document.getElementById(appRegion + "off").checked;
                    if (notify) {
                        sendNotification(appRegion, app, "offline");
                    }
                }
                if (appStatus === "Online") {
                    let currentOnlineStatus = onlineStatus;
                    if(currentOnlineStatus[appRegion] === undefined){
                        currentOnlineStatus[appRegion] = 1;
                    }
                    else{
                        currentOnlineStatus[appRegion]++;
                    }
                    setOnlineStatus(currentOnlineStatus);
                    if (currentOnlineStatus[appRegion] === 4) {
                        const notify = document.getElementById(appRegion + "on").checked;
                        if (notify) {
                            sendNotification(appRegion, app, "online");
                        }
                    }
                }

            })
            .catch((error) => {
                console.error("Error:", error);
                setStatuses((prevStatuses) => ({
                    ...prevStatuses,
                    [appIPasID]: "Offline",
                }));
                const notify = document.getElementById(appRegion+"off").checked;
                if (notify) {
                    sendNotification(appRegion, app, "offline");
                }
            });
    };
    const sendNotification = (appRegion, app, type) => {
        if ("Notification" in window) {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    if(type==="offline"){
                        new Notification(`${app} is down in ${appRegion} region`);
                    }
                    else{
                        new Notification(`All apps are up in ${appRegion} region`);
                    }
                    
                }
            });
        }
    }

    const handleRefreshChange = (e) => {
        localStorage.setItem('refreshInterval', e.target.value);
        setRefreshInterval(e.target.value);
    }

    return (
        <body>
            <header className="App-header" style={{backgroundColor: props.theme?'#282c34':'#b0b0b0'}}>
                <div style={{ width: "80vw", display: "flex", padding: "10px" }}>
                    <Button onClick={() => { setRefresh(!refresh) }}><IoMdRefresh size="30px" /></Button>
                    <button onClick={toggleSettings}> <FaCog/> </button>
                </div>

                <div style={{ width: "80vw" }}>
                    <Table bordered style={{ borderColor: props.theme?'white':'black' }}>
                        <thead>
                            <tr style={{ color: props.theme?'white':'black' }}>
                                <th width="100">Server</th>
                                <th width="150">FRONTEND_APP</th>
                                <th width="150">BACKEND_APP</th>
                                <th width="150">REST_API1</th>
                                <th width="150">REST_API2</th>
                                <th width="175">Notify down</th>
                                <th width="175">Notify up</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appPorts && appPorts.map((app) => (
                                <tr key={app.name}>
                                    <td style={{ color: props.theme?'white':'black' }}>{app.name}</td>
                                    <td onClick={() => { window.open(`${app.urls.FRONTEND_APPLICATION}`, '_blank'); }} className={statuses[`${app.urls.FRONTEND_APPLICATION}`] === 'Online' ? 'bg-success' : 'bg-danger'}>
                                        {statuses[`${app.urls.FRONTEND_APPLICATION}`] || "Loading..."}</td>
                                    <td onClick={() => { window.open(`${app.urls.BACKEND_APPLICATION}/`, '_blank'); }} className={statuses[`${app.urls.BACKEND_APPLICATION}`] === 'Online' ? 'bg-success' : 'bg-danger'}>
                                        {statuses[`${app.urls.BACKEND_APPLICATION}`] || "Loading..."}</td>
                                    <td onClick={() => { window.open(`${app.urls.REST_API1}/`, '_blank'); }} className={statuses[`${app.urls.REST_API1}`] === 'Online' ? 'bg-success' : 'bg-danger'}>
                                        {statuses[`${app.urls.REST_API1}`] || "Loading..."}</td>
                                    <td onClick={() => { window.open(`${app.urls.REST_API2}/`, '_blank'); }} className={statuses[`${app.urls.REST_API2}`] === 'Online' ? 'bg-success' : 'bg-danger'}>
                                        {statuses[`${app.urls.REST_API2}`] || "Loading..."}</td>
                                    <td>
                                        <Form.Check id={app.name + "off"} value={app.name} type="switch" />
                                    </td>
                                    <td>
                                        <Form.Check id={app.name + "on"} value={app.name} type="switch" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
                {showSettings &&
                    <div className="settings-panel" onClick={toggleSettings}>
                        <div className="settings-content" onClick={(event) => event.stopPropagation()} style={{backgroundColor: props.theme?'#56585d':'#ffffff'}}>
                            <div>
                                <Form.Label>Refresh interval in sec</Form.Label>
                                <Form.Control min="10" max="600" type="number" value={refreshInterval} onChange={handleRefreshChange} />
                            </div>
                        </div>
                    </div>
                }
            </header>
        </body>
    );
}
export default AppStatus;