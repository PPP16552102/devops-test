const http = require('http')

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    if(req.method == 'POST' && req.url == '/webhook'){
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