const express = require('express');

const fs = require("fs");

const appStatus = express.Router();

let appPorts;

try {
    appPorts = JSON.parse(fs.readFileSync("./config/AppURLforStatus.json", "utf-8"));
} catch (error) {
  console.error(error);
  process.exit(1);
}

appStatus.get('/api/fetch_app_urls', (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.send(appPorts)

});

module.exports = appStatus;