let http = require('http');

http.get('https://www.baidu.com/', res => {
  let data = '';
  res.on('data', chunk => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('result: ' + data);
  });
});
