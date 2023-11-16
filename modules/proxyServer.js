let http = require('http');
const express = require('express');
const path = require('path');
const fs = require('fs');

const proxyServer = express.Router();

proxyServer.get('/proxy', (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if(req.query.url.startsWith("https")){
    http = require('https');
  }
  const url = new URL(req.query.url);
  const options = {
	  hostname:url.hostname,
	  port:url.port,
	  path: url.pathname + url.search,
	  headers:{
		  'User-Agent': 'Mozilla/5.0'
	  },
	  rejectUnauthorized:false
  };
  http.get(options, (response) => {
    if([400,401,402,403,404].includes(response.statusCode)){
      res.status(500).send('Error');
    }
    else{
      let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', () => {
      res.send(data);
    });
    }
    
  }).on('error', (error) => {
    res.status(500).send('Error');
  });
});

module.exports = proxyServer;
