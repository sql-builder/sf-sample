var fs = require('fs');
var exec = require("child_process").exec;
var logName = process.env.LOG_NAME


var obj = JSON.parse(fs.readFileSync('./environments.json', 'utf8'));
var TAGS = obj.tags;

var config = require('./environments.json');
console.log(config + '. tags:' + config.environments.schedules.tags);

console.log(`json_file: ${obj}`);
console.log(`TAGS: ${TAGS}`);

cmd = `gpg --quiet --batch --yes --decrypt --passphrase=$CREDENTIALS_GPG_PASSPHRASE --output  .df-credentials.json df-credentials.gpg;
dataform install;
dataform run --json $TAGS;`

console.log(`cmd: ${cmd}`);

exec(cmd, {cwd: process.env.PROJECT_LOCATION, env: {'PROJECT_LOCATION': process.env.PROJECT_LOCATION, 'CREDENTIALS_GPG_PASSPHRASE': process.env.CREDENTIALS_GPG_PASSPHRASE, 'PATH': process.env.PATH}}, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        fs.writeFileSync(logName, error.message, function (err) {
            if (err) console.log(err);
        });
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        fs.writeFileSync(logName, stderr, function (err) {
            if (err) console.log(err);
        });
        return;
    }
    console.log(`stdout: ${stdout}`);
    fs.writeFileSync(logName, stdout, function (err) {
        if (err) console.log(err);
    });
});

console.log('Successfully created the log file: ' + logName)
