const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const LOG_PATH = path.join(__dirname, '/log.txt');
let hasWrittenToLog = false;

const writeToLog = (message) => {
    if(!hasWrittenToLog){
        fs.writeFileSync(LOG_PATH, '');
        hasWrittenToLog = true;
    }
    console.log(message);
    fs.appendFileSync(LOG_PATH, `${message}\n`);
};

const websocketServer = new WebSocket.Server({port: 61112});
websocketServer.on('connection', () => {
    writeToLog('client connected');
});

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
        writeToLog('start request');
        sendWebsocketMessage(JSON.stringify({type: 'start'}));
        sendSuccessData(response);
        return;
    }
    if(request.url === '/stop'){
        writeToLog('stop request');
        sendWebsocketMessage(JSON.stringify({type: 'stop'}));
        sendSuccessData(response);
        return;
    }
    if(request.url === '/randomVoice'){
        writeToLog('random voice request');
        sendWebsocketMessage(JSON.stringify({type: 'randomVoice'}));
        sendSuccessData(response);
        return;
    }
    response.writeHead(404);
}).listen(61111);
writeToLog('Server running at http://127.0.0.1:61111/');
writeToLog('Websocket Server running at http://127.0.0.1:61112/');