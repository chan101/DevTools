import React, { useState, useEffect } from "react";
import { ButtonGroup, Button, Form, Container, Row, Col } from 'react-bootstrap';
import '../css/App.css';

const BCTools = (props) => {


    const [tool, setTool] = useState("regionChanger");
    const [region_config, setRegion_config] = useState();
    const [selectedRegion, setSelectedRegion] = useState('DEV');
    const [packageName, setPackageName] = useState('com.package.name');
    const [swaggerURL, setSwaggerURL] = useState('https://api1/rest/v3/api-docs');
    const [loading, setloading] = useState(false);

    useEffect(() => {
        fetch("http://localhost:8080/api/load_config", {
            header: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        })
            .then((response) => response.json())
            .then((json) => {
                setRegion_config(json.regions);
            });
    }, []);

    const toolChange = (e) => {
        setTool(e.target.value);
    }
    const regionChange = (event) => {
        setSelectedRegion(event.target.value);
    };

    const handleChange = () => {
        fetch("http://localhost:8080/api/changeLocalRegion?" + new URLSearchParams({ region: selectedRegion }),
            {
                header: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            })
            .then((response) => response.json())
            .then((json) => {
                alert(json.message);
            });
    }

    const handlePackageChange = (e) => {
        setPackageName(e.target.value);
    }

    const handleURLChange = (e) => {
        setSwaggerURL(e.target.value);
    }

    const handleGenerate = (type) => {
        setloading(true);
        const options = {
            method: 'POST',
            url: 'https://textapis.p.rapidapi.com/text',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                "type": type,
                "package": packageName,
                "swaggerURL": swaggerURL
            }
        };
        fetch('http://localhost:8080/api/codeGen', options)
            .then(res => res.json())
            .then(res => {
                if (res.message === 'success') {
                    setloading(false);
                }
            })
    }


    return (
        <body>
            <div className={loading ? 'loading-screen active' : 'loading-screen'}>
                <div className="loading-spinner"></div>
            </div>
            <header className="App-header" style={{ backgroundColor: props.theme ? '#282c34' : '#b0b0b0' }}>
                <div className="tool_menu">
                    <ButtonGroup size="lg" className="mb-2">
                        <Button variant="primary" active={tool === "regionChanger"} value="regionChanger" onClick={toolChange}>Local Region Changer</Button>
                        <Button variant="primary" active={tool === "stubs"} value="stubs" onClick={toolChange}>Stubs Generator</Button>
                        <Button variant="primary" active={tool === "systemcode"} value="systemcode" onClick={toolChange}>System Code Generator</Button>
                    </ButtonGroup>
                </div>
                <div>
                    {tool === "regionChanger" &&
                        <div>
                            <Form.Select id='regionSelect' value={selectedRegion} onChange={regionChange}>
                                {region_config && region_config.map((region) => (
                                    <option value={region.name}>{region.name}</option>
                                ))}
                            </Form.Select>
                            <Button variant="success" onClick={handleChange}>Change</Button>
                        </div>
                    }
                    {tool === "stubs" &&
                        <Container >
                            <Row >
                                <Form.Label>Java Package Name</Form.Label>
                                <Form.Control type="text" defaultValue='com.rest.stubs' onChange={handlePackageChange} />
                            </Row>
                            <Row >
                                <Form.Label>Swagger URL</Form.Label>
                                <Form.Control type="text" defaultValue='http://<IP>:<PORT>/restapi/v3/api-docs' onChange={handleURLChange} />
                            </Row>
                            <Row >
                                <Col ><Button variant="success" onClick={() => { handleGenerate('stubs') }}>Generate Stubs</Button></Col>
                            </Row>

                        </Container>
                    }
                    {tool === "systemcode" &&
                        <Container >

                            <Row >
                                <Col > <Button variant="success" onClick={() => { handleGenerate('systemcode') }}>Generate System Code</Button></Col>
                            </Row>

                        </Container>
                    }
                </div>
            </header>
        </body>
    );
}
export default BCTools;
