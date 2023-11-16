const express = require('express');

const fs = require("fs");
const Client = require('ssh2').Client;


const { formatXml, formatJson, fapignore } = require('../utils.js');
const logviewer = express.Router();

let region_config;
let logFilesConfig;
let responseData;
let region;
let command;


try {
  region_config = JSON.parse(fs.readFileSync("./config/region_config.json", "utf-8"));
  logFilesConfig = JSON.parse(fs.readFileSync("./config/logFilesConfig.json", "utf-8"));
} catch (error) {
  process.exit(1);
}

logviewer.get('/api/fetch_log', (req, res) => {

  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  let sshClient = new Client();

  region_config.forEach(region1 => {
    if (region1.name === req.query.region) {
      region = region1
      let logFilePath = region.ssh.path + req.query.path + req.query.log;
      command = `cat ${logFilePath}`;
    }
  });

  sshClient.on('ready', () => {
    sshClient.exec(command, (err, stream) => {
      if (err) throw err;
      let data = '';
      stream.on('data', (chunk) => {
        data += chunk;
      }).on('close', () => {
        let dataFile = data.toString();
        if (req.query.xml === 'true') {
          if (req.query.json === 'true') {
            dataFile = formatXml(formatJson(dataFile));
          } else {
            dataFile = formatXml(dataFile);
          }
        } else if (req.query.json === 'true') {
          dataFile = formatJson(dataFile);
        }
        responseData = { message: dataFile };
        if (req.query.download === 'yes') {
          res.set('Content-disposition', 'attachment; filename=' + req.query.log);
          res.set('Content-type', 'text/plain');
          responseData = dataFile;
        }
        res.send(responseData);
      });
    });
  });

  sshClient.on('error', (err) => {
    sshClient.end();
    res.status(500).send({ message: 'Internal server error.' });
  });

  sshClient.on('end', () => {
  });

  sshClient.connect({
    host: region.ssh.ip,
    port: region.ssh.port,
    username: region.ssh.user,
    password: region.ssh.password
  });

});


logviewer.get('/api/load_config', (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.send({ regions: region_config, logFiles: logFilesConfig });
});

module.exports = logviewer;
