import {getSignaling, initRTC} from './scripts/helpers/rtc-helpers.js';

const startVoiceRecognition = () => {
    getSignaling().postMessage({type: 'start'});
};
const stopVoiceRecognition = () => {
    getSignaling().postMessage({type: 'stop'});
};
const setRandomVoice = () => {
    getSignaling().postMessage({type: 'randomVoice'});
};

const setup = () => {
    const region = document.getElementById('setup-region').value;
    const identity = document.getElementById('setup-identity').value;
    const device = document.getElementById('setup-device').value;
    getSignaling().postMessage({type: 'setup', region, identity, device});
};

const setUpEventHandlers = () => {
    const startButton = document.getElementById('start-button');
    startButton.onclick = startVoiceRecognition;
    const stopButton = document.getElementById('stop-button');
    stopButton.onclick = stopVoiceRecognition;
    const randomVoiceButton = document.getElementById('random-voice-button');
    randomVoiceButton.onclick = setRandomVoice;
    const setupButton = document.getElementById('setup-button');
    setupButton.onclick = setup;
};

setUpEventHandlers();
initRTC();