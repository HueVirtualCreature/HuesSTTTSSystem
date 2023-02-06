import {initRTC} from "./helpers/rtc-helpers.js";
import {toggleVoiceRecognition} from './voice-recognition.js';
import {voiceOptionsDropdown_onChange} from './state/selected-voice.js';
// read/write from cookie as to state
// init the connection if cookie says so.
// have the connection alive
// do the thing if the websocket happens

let websocketsOn = false;

const websocketPortInput = document.getElementById('websocket-port-input');
const websocketToggleButton = document.getElementById('websocket-toggle-button');

export const initLocalRTC = () => {
    //read from cookie
    //update UI
    // start connection if needed
    initRTC(({type}) => {
        if(type === 'start'){
            toggleVoiceRecognition(true, true);
            return;
        }
        if(type === 'stop'){
            toggleVoiceRecognition(true, false);
            return;
        }
        if(type === 'randomVoice'){
            const voiceDropdown = document.getElementById("voice-options-dropdown");
            const options = voiceDropdown.options;
            const randomOption = options[Math.floor(Math.random() * options.length)].value;
            voiceDropdown.value = randomOption;
            voiceOptionsDropdown_onChange();
            return;
        }
        console.log(`Unrecognized message ${JSON.stringify(type)}`);
    });
};