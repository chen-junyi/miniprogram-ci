const ci = require('miniprogram-ci');

/* 项目配置 */
const projectConfig = require('./project.config.json');
const versionConfig = require('./version.config.json');

const project = new ci.Project({
    appid: projectConfig.appid,
    type: 'miniProgram',
    projectPath: projectConfig.miniprogramRoot,
    privateKeyPath: './private.upload.key',
    ignores: ['node_modules/**/*'],
});

async function upload({ version = '0.0.0', desc = 'test' }) {
    return await ci.upload({
        project,
        version,
        desc: desc,
        setting: {
            es7: true,
            minify: true,
            autoPrefixWXSS: true
        },
        onProgressUpdate: console.log,
    })
}

async function preview({ version = '0.0.0', versionDesc = 'test' }) {
    return await ci.upload({
        project,
        desc: 'hello', // 此备注将显示在“小程序助手”开发版列表中
        setting: {
            es6: true,
        },
        qrcodeFormat: 'image',
        qrcodeOutputDest: './destination.jpg',
        onProgressUpdate: console.log,
        // pagePath: 'pages/index/index', // 预览页面
        // searchQuery: 'a=1&b=2',  // 预览参数 [注意!]这里的`&`字符在命令行中应写成转义字符`\&`
    })
}

console.log(upload(versionConfig))