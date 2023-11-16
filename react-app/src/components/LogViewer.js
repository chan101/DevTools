import React, { useState, useEffect } from 'react';
import { Button, Form, Nav, Container, Row, Col } from 'react-bootstrap';
import { FaDownload, FaCompress, FaExpand, FaCog } from 'react-icons/fa';
import '../css/App.css';

function LogViewer(props) {

  const [selectedSection, setSelectedSection] = useState('FRONTEND_APPLICATION Log Viewer');
  const [selectedRegion, setSelectedRegion] = useState('DEV');
  const [logFiles, setLogFiles] = useState();
  const [selectedLog, setSelectedLog] = useState("communication.log");
  const [logText, setLogText] = useState('');
  const [region_config, setRegion_config] = useState();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [wordWrap, setWordWrap] = useState(()=>{
    return localStorage.getItem('wordWrap') === 'yes';
  });
  const [logPath, setLogPath] = useState("frontEnd_logs/");
  const [fontSize, setFontSize] = useState(()=>{
    return localStorage.getItem('fontSize') === null ? '14':localStorage.getItem('fontSize');
  });
  const [xmlFormat, setXmlFormat] = useState(()=>{
    return localStorage.getItem('xmlFormat') === 'yes';
  });
  const [jsonFormat, setJsonFormat] = useState(()=>{
    return localStorage.getItem('jsonFormat') === 'yes';
  });
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleButtonClick = (buttonName) => {
    setSelectedSection(buttonName);
    if (buttonName === "BACKEND_APPLICATION Log Viewer") {
      setSelectedLog("Error.log");
      setLogPath("backEnd_logs/webservice/");
    }
    else {
      setSelectedLog("communication.log");
      setLogPath("frontEnd_logs/");
    }
  };

  const regionChange = (event) => {
    setSelectedRegion(event.target.value);

  };

  const handleOptionChange = (e) => {
    setSelectedLog(e.target.value);
    let selectedPath = e.target.options[e.target.selectedIndex].getAttribute('path');
    setLogPath(selectedPath);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const getLog = (log, download = "no") => {
    setLoading(true);
    if (download === 'yes') {
      window.open('http://localhost:8080/api/fetch_log?' + new URLSearchParams({
        log: log,
        region: selectedRegion,
        path: logPath,
        download: download,
        xml: xmlFormat,
        json: jsonFormat
      }), '_blank');
      setLoading(false);
    }
    else {
      fetch('http://localhost:8080/api/fetch_log?' + new URLSearchParams({
        log: log,
        region: selectedRegion,
        path: logPath,
        download: download,
        xml: xmlFormat,
        json: jsonFormat
      }))
        .then((response) => response.json())
        .then((data) => {
          setLogText(data.message);
          setLoading(false);
        });
    }

  }

  const toggleWordWrap = () => {
    const newWordWrap = !wordWrap;
    localStorage.setItem('wordWrap', newWordWrap ? 'yes' : 'no');
    setWordWrap(newWordWrap);
  }

  const toggleXmlFormat = () => {
    const newXmlFormat = !xmlFormat;
    localStorage.setItem('xmlFormat', newXmlFormat ? 'yes' : 'no');
    setXmlFormat(newXmlFormat);
  }

  const toggleJsonFormat = () => {
    const newJsonFormat = !jsonFormat;
    localStorage.setItem('jsonFormat', newJsonFormat ? 'yes' : 'no');
    setJsonFormat(newJsonFormat);
  }

  const handleFontChange = (e) => {
    localStorage.setItem('fontSize', e.target.value);
    setFontSize(e.target.value);
  }

  useEffect(() => {
    fetch("http://localhost:8080/api/load_config", {
      header: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((json) => {
        setLogFiles(json.logFiles);
        setRegion_config(json.regions);
      });
  }, []);

  return (
    <div >
      <div className={loading ? 'loading-screen active' : 'loading-screen'}>
        <div className="loading-spinner"></div>
      </div>
      <header className="App-header" style={{backgroundColor: props.theme?'#282c34':'#b0b0b0'}}>
        {!isFullScreen &&
          <Container fluid="md">
            <Row className="justify-content-end">
              <Col xs={1} >
                <Form.Select id='regionSelect' value={selectedRegion} onChange={regionChange}>
                  {region_config && region_config.map((region) => (
                    <option value={region.name}>{region.name}</option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
            <Row className="justify-content-center" style={{ margin: '0 40px', padding: '40px' }}>
              <Nav variant="pills" className="justify-content-center" activeKey={selectedSection}>
                <Nav.Item>
                  <Nav.Link eventKey="FRONTEND_APPLICATION Log Viewer" onClick={() => handleButtonClick('FRONTEND_APPLICATION Log Viewer')}>FrontEnd Log Viewer</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="BACKEND_APPLICATION Log Viewer" onClick={() => handleButtonClick('BACKEND_APPLICATION Log Viewer')}>BackEnd Log Viewer</Nav.Link>
                </Nav.Item>
              </Nav>
            </Row>
          </Container>
        }

        {(selectedSection === "FRONTEND_APPLICATION Log Viewer" || selectedSection === "BACKEND_APPLICATION Log Viewer") &&
          <div>
            <Container>
              <Row className="justify-content-center">
                <Col>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Form.Select value={selectedLog} onChange={handleOptionChange} style={{ width: 'auto', marginRight: '50px', fontSize: 'large' }}>
                      {logFiles && logFiles[selectedSection === "FRONTEND_APPLICATION Log Viewer" ? "FRONTEND_APPLICATION" : "BACKEND_APPLICATION"].map((logFile) => (
                        <option value={logFile.filename} path={logFile.path}>{logFile.filename}</option>
                      ))}
                    </Form.Select>
                    <Button variant="primary" onClick={() => getLog(selectedLog)} style={{ marginRight: '25px' }}>Fetch log</Button>
                    <Button variant="success" onClick={() => getLog(selectedLog, 'yes')}><FaDownload /></Button>
                  </div>
                </Col>
              </Row>
            </Container>
            <div style={{
              position: isFullScreen ? "fixed" : "relative", top: isFullScreen ? 0 : "auto",
              left: isFullScreen ? 0 : "auto", zIndex: isFullScreen ? 8 : "auto"
            }}>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button onClick={toggleFullScreen}>
                  {isFullScreen ? <FaCompress /> : <FaExpand />}
                </button>
                <button onClick={toggleSettings}>
                  <FaCog />
                </button>
              </div>
              <p style={{
                width: isFullScreen ? "95vw" : "75vw", height: isFullScreen ? "88vh" : "50vh",
                whiteSpace: 'pre-wrap', textAlign: "left", wordWrap: wordWrap ? "break-word" : "",
                fontSize: fontSize ? fontSize + "px" : "17px", backgroundColor: props.theme?'#000000':'#ffffff',
                color: props.theme?'#fff':'#000'
              }}
                className="code-block">{logText}</p>

              {showSettings &&
                <div className="settings-panel" onClick={toggleSettings}>
                  <div className="settings-content" onClick={(event) => event.stopPropagation()} style={{backgroundColor: props.theme?'#56585d':'#ffffff'}}>
                    <Form.Check className='customFrom' type="switch" id="custom-switch" label="Wordwrap" onChange={toggleWordWrap} checked={wordWrap} />
                    <Form.Check className='customFrom' type="switch" id="custom-switch" label="Format XML" onChange={toggleXmlFormat} checked={xmlFormat} />
                    <Form.Check className='customFrom' type="switch" id="custom-switch" label="Format JSON" onChange={toggleJsonFormat} checked={jsonFormat} />
                    <label>
                      Font Size:
                      <input type="range" min="10" max="30" value={fontSize} onChange={handleFontChange} />
                      {fontSize} px
                    </label>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </header>
    </div>
  );
}

export default LogViewer;
