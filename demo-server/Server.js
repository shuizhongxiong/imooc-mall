let http = require('http');
let url = require('url');
let fs = require('fs');

let server = http.createServer((req, res) => {
  // res.statusCode = 200;
  // res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  let pathName = url.parse(req.url).pathname;
  fs.readFile(pathName.substring(1), (err, data) => {
    if (err) {
      res.writeHead(404, {
        'Content-Type': 'text/html'
      });
    } else {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.write(data);
      res.end();
    }
  });
});

server.listen(3000, '127.0.0.1', () => {
  console.log('服务器已经运行，请打开浏览器，输入 127.0.0.1:3000 来进行访问。')
})