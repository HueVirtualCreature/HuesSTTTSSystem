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

const setUpEventHandlers = () => {
    const startButton = document.getElementById('start-button');
    startButton.onclick = startVoiceRecognition;
    const stopButton = document.getElementById('stop-button');
    stopButton.onclick = stopVoiceRecognition;
    const randomVoiceButton = document.getElementById('random-voice-button');
    randomVoiceButton.onclick = setRandomVoice;
};

setUpEventHandlers();
initRTC();