const ci = require('miniprogram-ci');
/* 项目配置 */
const projectConfig = require('./project.config.json');
const version = require('./package.json').version
const fs = require('fs')
const [, , ref, desc] = process.argv
const { exec } = require('child_process');

// 同步push的分支代码
function getLatestBranch(branch = ref) {
    return exec(`git checkout '${branch}' && git pull`,
        function (error) {
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        })
}

// 根据分支改写环境变量文件，实现分支和环境统一
function writeEnvFile() {
    return fs.writeFileSync('./miniprogram/env.js', `export const env = '${ref}'`, err => {
        if (err) {
            console.log(err, '写入变量文件失败');
        }
    });
}

const project = new ci.Project({
    appid: projectConfig.appid,
    type: 'miniProgram',
    projectPath: projectConfig.miniprogramRoot,
    privateKeyPath: './private.upload.key',
    ignores: ['node_modules/**/*'],
});

async function upload({ version, desc }) {
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

async function preview({ version, desc }) {
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

async function start() {
    await getLatestBranch()
    await writeEnvFile()
    await upload({ version, desc: `${desc} 环境：${ref}` })
    console.log('upload success')
}

start()
