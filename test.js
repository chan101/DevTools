const express = require('express');

const api = express();
api.get('/*', (req, res) => {
    res.send("test");
});
api.listen(3001);

const api1 = express();
api1.get('/*', (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.send("test");
});
api1.listen(3002);

const api2 = express();
api2.get('/*', (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.send("test");
});
api2.listen(3003);

const api3 = express();
api3.get('/*', (req, res) => {
    res.send("test");
});
api3.listen(3004);