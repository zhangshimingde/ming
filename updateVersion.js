const path = require('path');
const fs = require('fs');
const loadJsonFile = require('load-json-file');

const filePath = path.resolve(__dirname, 'package.json');

function getJsonData() {
    const packageData = loadJsonFile.sync(filePath);
    return packageData;
}

function getNewVersion(version) {
    const versionNum = +(`${version}`.replace(/\./g, ''));
    return `${versionNum + 1}`.split('').join('.');
}

function updateVersion(data) {
    fs.writeFileSync(filePath, data);
}
function exec() {
    const jsonData = getJsonData();
    const newVersion = getNewVersion(jsonData.version);
    jsonData.version = newVersion;
    updateVersion(JSON.stringify(jsonData, null, 4));
}

exec();
