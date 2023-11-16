const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { Client } = require('ssh2');

const webSockapp = express();
const WebSocketServer = http.createServer(webSockapp);
const wss = new WebSocket.Server({ server: WebSocketServer });
const fs = require("fs");
let devAppsSettings;

try {
  devAppsSettings = JSON.parse(fs.readFileSync("./config/devAppsSettings.json", "utf-8"));
} catch (error) {
  process.exit(1);
}
const sshConfig = devAppsSettings.DevSSHConfig;

wss.on('connection', function connection(ws) {
  console.log('new Client');
  ws.on('error', console.error);
  ws.on('message', function message(data) {
    const JsonData = JSON.parse(data);
    const ssh = new Client();

    ssh.on('error', (err) => {
      console.error('SSH connection error:', err);
      ws.send(JSON.stringify({ type: 'output', data: 'SSH connection error\n' }));
      ws.send(JSON.stringify({ type: 'complete' }));
    });

    ssh.on('ready', () => {
      ssh.exec("sh AIO.sh "+JsonData.app+" "+JsonData.action+" "+JsonData.warVersion, (err, stream) => {
        stream.on('data', data => {
          ws.send(JSON.stringify({ type: 'output', data: data.toString() }));
        });
        stream.on('close', () => {
          ssh.end();
          ws.send(JSON.stringify({ type: 'complete' }));
        });
      });
    }).connect(sshConfig);
  });
});

////////////some apis///////////////////

const https = require('https');
const xml2js = require('xml2js');


const url = devAppsSettings.FRONTEND_APPLICATION.warlist;

const client = url.startsWith('https') ? https : http;

const DevServerAppsApi = express.Router();

DevServerAppsApi.get('/api/fetch_war_list', (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  client.get(url, (res1) => {
    let data = '';
    res1.on('data', (chunk) => {
      data += chunk;
    });
    res1.on('end', () => {
      // Use xml2js to parse the XML data into a JavaScript object
      xml2js.parseString(data, (err, result) => {
        if (err) {
          console.error(err);
        } else {
          const list = result.metadata.versioning[0].versions[0].version;
          res.send(list.slice(-30).reverse());
        }
      });
    });
  }).on('error', (err) => {
    console.error(err);
  });
});


module.exports = {WebSocketServer, DevServerAppsApi};
