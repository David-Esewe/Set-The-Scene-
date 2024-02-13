const express   = require('express');
const app       = express();
const http      = require('http');
const server    = http.createServer(app);

const LISTEN_PORT = 8080;

//middleware to serve static files as public folder as root
app.use(express.static(__dirname + '/public'));

//create our routes
app.get('/', function(req,res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/test', function(req,res) {
    res.sendFile(__dirname + '/public/test.html');
});

app.get('/video', function(req,res) {
    res.sendFile(__dirname + '/public/video.html');
});

//start our server
server.listen(LISTEN_PORT);
console.log('server started on port ' + LISTEN_PORT);
