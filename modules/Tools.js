const express = require('express');
const fs = require("fs");
const Client = require('ssh2-sftp-client');
const { exec } = require('child_process');
const bodyParser = require('body-parser');
const path = require('path');

const bcTools = express.Router();

let region_config;

try {
    region_config = JSON.parse(fs.readFileSync("./config/region_config.json", "utf-8"));
    bcTools_config = JSON.parse(fs.readFileSync("./config/bcTools_config.json", "utf-8"));
} catch (error) {
    console.error(error);
    process.exit(1);
}

bcTools.use(bodyParser.json());

bcTools.get('/api/changeLocalRegion', (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    region_config.forEach(region => {
        if (region.name === req.query.region) {
            const sftp = new Client();
            const service_config_file = region.sftp.path + "BC/channels_home/properties/ChannelsProductDeployment/config/service_config.xml";
            const certificate_file = region.sftp.JAVA_HOME + "lib/security/cacerts";
            const local_api_url_file = bcTools_config.local_api_url_file;
            const local_certificate_file = bcTools_config.local_certificate_file;
            sftp.connect({
                host: region.sftp.ip,
                port: region.sftp.port,
                username: region.sftp.user,
                password: region.sftp.password
            }).then(() => {
                return Promise.all([sftp.get(service_config_file, local_api_url_file), sftp.get(certificate_file, local_certificate_file)]);
            })
                .then(() => {
                    console.log('Files placed');
                    res.send({ message: 'Files placed' });
                    sftp.end();
                })
                .catch((err) => {
                    console.log(err);
                    sftp.end();
                    res.send({ message: 'Error: ' + err.message });
                });
        }
    });

});

bcTools.post('/api/codeGen', (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    const type = req.body.type;
    const package = req.body.package;
    const swaggerURL = req.body.swaggerURL;

    if (type === 'stubs'){
        exec('cd lib\\swagger_codegen\\bin && generate.bat '+swaggerURL+' '+package+' stubs_for_module >NUL 2>&1',(err,stdout,stderr)=>{
            const currDir = __dirname;
            const relapath = 'lib\\swagger_codegen\\output\\stubs_for_module\\src\\main\\java\\com\\package\\path';
            const absPath = path.join(currDir,'..','..','..',relapath);
            exec(`explorer ${absPath}`);
            res.send('done');
        })

    }
    else if (type === 'systemcode'){
        exec('cd lib\\systemcode_generator && generate.bat>NUL 2>&1',(err,stdout,stderr)=>{
            const currDir = __dirname;
            const relapath = 'lib\\systemcode_generator';
            const absPath = path.join(currDir,'..','..','..',relapath);
            exec(`explorer ${absPath}`);
            res.send('done');
        })
    }
	else{
		res.send('invalid data');
	}

    
});


module.exports = bcTools;