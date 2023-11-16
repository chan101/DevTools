import React, { useState, useEffect } from "react";
import { Button, ButtonGroup, Form, Nav, Container, Row, Col, Dropdown } from 'react-bootstrap';
import { FaServer } from 'react-icons/fa';
import { BsFillGearFill } from 'react-icons/bs';
import '../css/App.css';

const DevServerApps = (props) => {


    const [selectedSection, setSelectedSection] = useState('FRONTEND_APPLICATION Apps');
    const [output, setOutput] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [selectedWar, setSelectedWar] = useState("");
    const [warlist, setWarlist] = useState();
    const ws = new WebSocket('ws://localhost:5000');

    useEffect(() => {
        fetch("http://localhost:8080/api/fetch_war_list", {
            header: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        })
            .then((response) => response.json())
            .then((wars) => {
                setWarlist(wars);
            });
    }, []);

    const handleAppChange = (buttonName) => {
        setSelectedSection(buttonName);
    }

    const handleAppAction = async (e) => {
        if(selectedWar==='' && false)
        {
            alert("Select a war version");
        }
        else{
        setDisabled(true);
        document.getElementsByClassName("sidebarButton")[0].style.pointerEvents = 'none';
        setOutput("----------------------------" + e.target.getAttribute('value') + "----------------------------\n\n");

        ws.onopen = () => {
            console.log("Connected");
        };
        ws.onmessage = (e1) => {
            const JsonData = JSON.parse(e1.data);
            if (JsonData.type === 'output') {
                setOutput(prevOutput => prevOutput + JsonData.data);
            }
            else if (JsonData.type === 'complete') {
                setOutput(prevOutput => prevOutput + "\n----------------------------" + e.target.getAttribute('value') + "_Complete----------------------------");
                ws.close();
                setDisabled(false);
                document.getElementsByClassName("sidebarButton")[0].style.pointerEvents = '';
            }
        }
        const value = e.target.getAttribute('value').split("_");
        ws.send(JSON.stringify({ app: value[0], action: value[1], warVersion: value[2] }));
    }
    }

    const handleWarChange = (e) => {
        setSelectedWar(e.target.value);
    }

    const formatDate = (dateString) => {
        const date = dateString.split(".");
        const year = "20" + date[0]
        const month = date[1];
        const day = date[2];
        const hour = date[3].slice(0,2);
        const minute = date[3].slice(2, 4);
        const second = date[3].slice(4, 6);
      
        const formattedDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`).toLocaleString();
      
        return formattedDate;
      };

    return (
        <header className="App-header" style={{backgroundColor: props.theme?'#282c34':'#b0b0b0'}}>
            <Container>
                <div className={disabled ? 'disabled' : ''}>
                    <Row className="justify-content-center" style={{ margin: '0 10px', padding: '40px' }}>
                        <Col sm={4}>
                            <div >
                                <Nav variant="pills" className="justify-content-center" activeKey={selectedSection}>
                                    <Nav.Item>
                                        <Nav.Link eventKey="FRONTEND_APPLICATION Apps" onClick={() => handleAppChange('FRONTEND_APPLICATION Apps')}>Frontend App</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="BACKEND_APPLICATION Apps" onClick={() => handleAppChange('BACKEND_APPLICATION Apps')}>BackEnd Apps</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </div>
                        </Col>
                    </Row>

                    {selectedSection === 'FRONTEND_APPLICATION Apps' &&
                        <Row>
                            <Col>
                                <Dropdown as={ButtonGroup}>
                                    <Button variant="danger"><FaServer size="30px" />  Branch Channel</Button>
                                    <Dropdown.Toggle split variant="danger" id="dropdown-split-basic" />
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={handleAppAction} value="FRONTEND_APPLICATION_Stop">Stop</Dropdown.Item>
                                        <Dropdown.Item onClick={handleAppAction} value="FRONTEND_APPLICATION_Start">Start</Dropdown.Item>
                                        <Dropdown.Item onClick={handleAppAction} value="FRONTEND_APPLICATION_Restart">Restart</Dropdown.Item>
                                        <Dropdown.Item onClick={handleAppAction} value="FRONTEND_APPLICATION_Redeploy">Redeploy</Dropdown.Item>
                                        <Dropdown.Item onClick={handleAppAction} value="FRONTEND_APPLICATION_RedeployDebug">Redeploy_Debug</Dropdown.Item>
                                        <Dropdown.Item onClick={handleAppAction} value="FRONTEND_APPLICATION_Bancs.sh">Bancs.sh</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                            <Col className="d-flex align-items-center">
                                <Form.Select aria-label="Default select example" disabled={warlist===undefined} onChange={handleWarChange} style={{ width: "300px", paddingRight: "100px" }}>
                                    <option value="">Select the War to deploy</option>
                                    {warlist && warlist.map((war) => (
                                        <option value={"FRONTEND_APPLICATION_Deploy_"+war}>{formatDate(war)}</option>
                                    ))}
                                </Form.Select>
                                <Button variant="primary" disabled={warlist===undefined} className="ms-2" onClick={handleAppAction} value={selectedWar}>Deploy Frontend War</Button>
                            </Col>
                        </Row>}
                    {selectedSection === 'BACKEND_APPLICATION Apps' &&
                        <Row className="justify-content-center">
                            <Col>
                                <Dropdown as={ButtonGroup}>
                                    <Button variant="success"><FaServer size="30px" />  Back Office</Button>
                                    <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={handleAppAction} value="BACKEND_APPLICATION__Stop">Stop</Dropdown.Item>
                                        <Dropdown.Item onClick={handleAppAction} value="BACKEND_APPLICATION__Start">Start</Dropdown.Item>
                                        <Dropdown.Item onClick={handleAppAction} value="BACKEND_APPLICATION__Restart">Restart</Dropdown.Item>
                                        <Dropdown.Item onClick={handleAppAction} value="BACKEND_APPLICATION__Redeploy">Redeploy</Dropdown.Item>
                                        <Dropdown.Item onClick={handleAppAction} value="BACKEND_APPLICATION__Bancs.sh">Bancs.sh</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                            <Col>
                                <Dropdown as={ButtonGroup}>
                                    <Button variant="primary"><BsFillGearFill size="30px" />  REST_API1 Rest</Button>
                                    <Dropdown.Toggle split variant="primary" id="dropdown-split-basic" />
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={handleAppAction} value="REST_API1_Stop">Stop</Dropdown.Item>
                                        <Dropdown.Item onClick={handleAppAction} value="REST_API1_Start">Start</Dropdown.Item>
                                        <Dropdown.Item onClick={handleAppAction} value="REST_API1_Restart">Restart</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                            <Col>
                                <Dropdown as={ButtonGroup}>
                                    <Button variant="warning"><BsFillGearFill size="30px" />  REST_API2 Rest</Button>
                                    <Dropdown.Toggle split variant="warning" id="dropdown-split-basic" />
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={handleAppAction} value="REST_API2_Stop">Stop</Dropdown.Item>
                                        <Dropdown.Item onClick={handleAppAction} value="REST_API2_Start">Start</Dropdown.Item>
                                        <Dropdown.Item onClick={handleAppAction} value="REST_API2_Restart">Restart</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                        </Row>}
                </div>
                <Row className="justify-content-center">
                    <Col >
                        <p style={{ height: "50vh", whiteSpace: 'pre-wrap', textAlign: "left", fontSize: "17px",
                        backgroundColor: props.theme?'#000000':'#ffffff', color: props.theme?'#fff':'#000' }} className="shell-block">
                            {output}
                        </p>
                    </Col>
                </Row>
            </Container>
        </header>
    )
}

export default DevServerApps;