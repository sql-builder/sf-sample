var fs = require('fs');
var exec = require("child_process").exec;
var logName = process.env.LOG_NAME

const obj = JSON.parse(fs.readFileSync('./environments.json', 'utf8'));
const TAGS = obj.environment.tags

console.log('Loading environment ' + obj.environment.name + ' with schedule of ' + obj.environment.schedule + '.');
console.log('If set, running tags: ' + obj.environment.tags + '.');

// var a = 'route 3';
// if(a === 'route 1' || a === 'route 2'){
//   console.log('true')
// }else{
//   console.log('false')
// }

// Check if tags are set
// if(typeof TAGS === null){
//   console.log('true')
// }else{
//   cmd = `gpg --quiet --batch --yes --decrypt --passphrase=$CREDENTIALS_GPG_PASSPHRASE --output  .df-credentials.json df-credentials.gpg;
//          dataform install;
//          dataform run --json ${TAGS};`
// }


cmd = `gpg --quiet --batch --yes --decrypt --passphrase=$CREDENTIALS_GPG_PASSPHRASE --output  .df-credentials.json df-credentials.gpg;
dataform install;
dataform run --json --tags ${TAGS};`

console.log(`Running command: dataform run --json ${TAGS};`);

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
