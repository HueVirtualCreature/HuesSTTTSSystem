const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const websocketServer = new WebSocket.Server({port: 61112});
websocketServer.on('connection', () => {
    console.log('client connected');
});

const getContentTypeForFileName = (fileName) => {
    const extname = path.extname(fileName);
    if(extname === '.js'){
        return 'text/javascript';
    }
    if(extname === '.css'){
        return 'text/css';
    }

    return 'text/html';
};

const handleFileRoute = (filePath, response) => {
    if(!fs.existsSync(filePath)){
        response.writeHead(404);
        return;
    }
    response.writeHead(200, { 'Content-Type': getContentTypeForFileName(filePath)});
    response.end(fs.readFileSync(filePath), 'utf8');
};

const sendWebsocketMessage = (messageToSend) => {
    websocketServer.clients.forEach(client => {
        if (client.readyState !== WebSocket.OPEN) {
            return;
        }
        client.send(messageToSend);
    });
};

const sendSuccessData = (response) => {
    response.writeHead(200, { 'Content-Type': 'text'});
    response.end('done', 'utf8');
};

http.createServer(function (request, response) {
    const sanitizedUrl = request.url.split('?')[0];
    if(request.url === '/start'){
        console.log('start request');
        sendWebsocketMessage(JSON.stringify({type: 'start'}));
        sendSuccessData(response);
        return;
    }
    if(request.url === '/stop'){
        console.log('stop request');
        sendWebsocketMessage(JSON.stringify({type: 'stop'}));
        sendSuccessData(response);
        return;
    }
    if(request.url === '/randomVoice'){
        console.log('random voice request');
        sendWebsocketMessage(JSON.stringify({type: 'randomVoice'}));
        sendSuccessData(response);
        return;
    }

    let filePath = '..' + sanitizedUrl;
    if (filePath === '../'){
        filePath = '../MicrophonePolly.html';
    }
    handleFileRoute(filePath, response);

}).listen(61111);
console.log('Server running at http://127.0.0.1:61111/');
console.log('Websocket Server running at http://127.0.0.1:61112/');