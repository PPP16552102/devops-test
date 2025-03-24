const http = require('http')
const crypto = require('crypto')
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
            let event = req.headers['x-gitHub-event'];
            let signature = req.headers['x-hub-signature'];

            if(signature !== sign(body)){
                return res.end('Not Allow');
            }
        })

        // 给github服务器返回一个响应
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            ok: true
        }))
    }else{
        res.end('Not Found');
    }
})

server.listen(4000, () => {
    console.log('port 4000 listening');
})