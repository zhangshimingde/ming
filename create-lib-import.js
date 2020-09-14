const fs = require('fs');
const path = require('path');

const libDir = path.resolve(__dirname, 'lib');
const widgetDir = path.resolve(libDir, 'component', 'widget');
const fileRegx = /\.js$/;

function getExportContent(fileName) {
    return `import ${fileName} from './component/widget/${fileName}';
export default ${fileName};`;
}

function isFolder(fileName) {
    return !fileRegx.test(fileName);
}

function execute() {
    const files = fs.readdirSync(widgetDir);
    if (Array.isArray(files)) {
        files.forEach((fileName) => {
            if (isFolder(fileName)) {
                fs.writeFileSync(`${libDir}/${fileName}.js`, getExportContent(fileName));
            }
        });
    }
    fs.writeFileSync(`${libDir}/RouteWithLayout.js`,
        `import RouteWithLayout from './component/layout/RouteWithLayout';
export default RouteWithLayout;`);
    fs.writeFileSync(`${libDir}/fulu.js`,
        `import fulu from './component/fulu';
export default fulu;`);
    fs.writeFileSync(`${libDir}/handleErrCallBack.js`,
        `import { handleErrCallBack } from './component/fulu/utils/request';
export default handleErrCallBack;`);
    fs.writeFileSync(`${libDir}/handleErrNavCallBack.js`,
        `import { handleErrNavCallBack } from './component/fulu/utils/request';
export default handleErrNavCallBack;`);
}

execute();
