import {initRTC} from "./helpers/rtc-helpers.js";
import {toggleVoiceRecognition} from './voice-recognition.js';
import {voiceOptionsDropdown_onChange} from './state/selected-voice.js';
import {connectAws} from "./aws.js";
import {audioOutputDeviceDropdown_onChange} from './state/selected-audio-device.js';
// read/write from cookie as to state
// init the connection if cookie says so.
// have the connection alive
// do the thing if the websocket happens

let rtcOn = false;

const rtcToggleButton = document.getElementById('websocket-toggle-button');

export const initLocalRTC = () => {
    //read from cookie
    //update UI
    initRTC((event) => {
        // if(!rtcOn){
        //     return;
        // }
        const {type} = event;
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
        if(type === 'setup') {
            const {region, identity, audioDevice} = event;
            document.getElementById('awsRegionTextBox').value = region;
            document.getElementById('awsIdentityPoolTextBox').value = identity;
            connectAws();

            const options = document.getElementById('audio-devices-dropdown').options;
            let value = '';
            for(let x = 0; x < options.length; x+=1) {
                if(options[x].innerHtml === audioDevice){
                    value = options[x].value;
                }
            }
            document.getElementById('audio-devices-dropdown').value = value;
            audioOutputDeviceDropdown_onChange();
        }
        console.log(`Unrecognized message ${JSON.stringify(type)}`);
    });
};