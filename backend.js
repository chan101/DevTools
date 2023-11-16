const express = require('express');
const path = require('path');
const api = express();
const logviewer = require('./modules/LogViewerApis');
const { WebSocketServer, DevServerAppsApi } = require('./modules/DevServerAppsApis');
const appPorts = require('./modules/AppStatus');
const proxyServer = require('./modules/proxyServer');
const Tools = require('./modules/Tools');

const port = 8080;

api.use(logviewer);
api.use(DevServerAppsApi);
api.use(appPorts);
api.use(proxyServer);
api.use(Tools);

api.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

WebSocketServer.listen(5000);
/*
//////////////// The web app ///////////////

const webapp = express();

webapp.use(express.static(path.join(__dirname, "react-app", "build")));

webapp.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "react-app", "build", "index.html"));
});

webapp.listen(3000, () => {
  console.log("App is listening on port 3000");
});



////////////////////  For GUI  //////////////////


const { app } = require('electron');
const { BrowserWindow } = require('electron');

let win;

function createWindow() {
  win = new BrowserWindow({ width: 800, height: 600 });
  win.loadFile("backendUI/GUI.html");

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

api.get('/gui', (req, res) => {
  const { shell } = require('electron');
  shell.openExternal("http://localhost:3000/");
  res.send("opened in browser");
});

api.get('/openconfig', (req, res) => {
  const { exec } = require('child_process');

  exec(`cd config && start ${req.query.config}`, (error, stdout, stderr) => {
    res.send("opened config");
  });
});
*/