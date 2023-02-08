import {toggleVoiceRecognition} from './voice-recognition.js';
import {voiceOptionsDropdown_onChange} from './state/selected-voice.js';
import {getCookie, writeCookies} from "./helpers/cookies.js";

let websocketOn = false;
let websocketAddress = '';

const websocketToggleButton = document.getElementById('websocket-toggle-button');
const websocketCaption = document.getElementById('websocket-caption');
const websocketAddressInput = document.getElementById('websocket-address')

const updateAddressCookie = (newAddress) => {
    writeCookies('websocketAddress', newAddress);
    websocketAddress = newAddress;
};

const updateButtonUIAndCookies = () => {
    writeCookies('websocketON', websocketOn);
    if(websocketOn){
        websocketToggleButton.className = 'ui button negative';
        websocketToggleButton.innerText = 'Turn Websockets OFF';
        websocketCaption.innerText = 'Websockets is currently ON';
        return;
    }
    websocketToggleButton.className = 'ui button POSITIVE';
    websocketToggleButton.innerText = 'Turn Websockets ON';
    websocketCaption.innerText = 'Websockets is currently OFF';
};

websocketToggleButton.onclick = () => {
    websocketOn = !websocketOn;
    updateButtonUIAndCookies();
    if(websocketOn){
        initWebsocketConnection();
    }
};

let changeTimeout;
websocketAddressInput.onchange = () => {
    if(changeTimeout){
        clearTimeout(changeTimeout);
    }
    changeTimeout = setTimeout(() => {
        updateAddressCookie(websocketAddressInput.value);
        if(websocketOn){
            initWebsocketConnection();
        }
    }, 1000);
};

let websocket;
const initWebsocketConnection = () => {
    if(websocket){
        websocket.close();
    }
    websocket = new WebSocket(`ws://${websocketAddress}`);
    websocket.addEventListener('message', (e) => {
        const event = JSON.parse(e.data);
        const {type} = event;
        if(type === 'start'){
            toggleVoiceRecognition(undefined, true, true);
            return;
        }
        if(type === 'stop'){
            toggleVoiceRecognition(undefined, true, false);
            return;
        }
        if(type === 'randomVoice'){
            const voiceDropdown = document.getElementById("voice-options-dropdown");
            const options = voiceDropdown.options;
            voiceDropdown.value = options[Math.floor(Math.random() * options.length)].value;
            voiceOptionsDropdown_onChange();
            return;
        }
        console.log(`Unrecognized message ${JSON.stringify(type)}`);
    });
};

export const initLocalWebsockets = () => {
    if(getCookie('websocketON') === 'true'){
        websocketOn = true;
        updateButtonUIAndCookies();
    }
    if(getCookie('websocketAddress')){
        websocketAddress = getCookie('websocketAddress');
        websocketAddressInput.value = websocketAddress;
    }
    if(websocketOn){
        initWebsocketConnection();
    }
};