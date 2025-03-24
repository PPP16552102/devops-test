const http = require('http')
const crypto = require('crypto')
const { spawn } = require('child_process')

const { REPO_SHELL_MAP } = require('./constants')

const SECRETE = '123456' // 验证密码

function sign(body) {
    return `sha1=` + crypto.createHmac('sha1', SECRETE).update(body).digest('hex');
}

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    if(req.method == 'POST' && req.url == '/webhook'){
        let buffers = []
        
        req.on('data', (buffer) => {
            buffers.push(buffer);
        })

        req.on('end', () => {
            let body = Buffer.concat(buffers);
            let event = req.headers['x-github-event'];
            let signature = req.headers['x-hub-signature'];

            if(signature !== sign(body)){
                return res.end('Not Allow');
            }

            // 给github服务器返回一个响应
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                ok: true
            }))

            // 如果是push，开始部署
            if(event == 'push'){
                let payload = JSON.parse(body);
                // 根据仓库名称执行对应的sh脚本
                if(payload.repository.name && REPO_SHELL_MAP[payload.repository.name]){
                    let child = spawn('sh', [`./${REPO_SHELL_MAP[payload.repository.name]}`]);
                    let buffers = [];
                    child.stdout.on('data', (buffer) => {
                        buffers.push(buffer);
                    })

                    child.stdout.on('end', (buffer) => {
                        let logText = Buffer.concat(buffers);
                        console.log(logText);
                        console.log('build success');
                    })
                }
            }
        })
    }else{
        res.end('Not Found');
    }
})

server.listen(4000, () => {
    console.log('port 4000 listening');
})