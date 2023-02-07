import {getCookie} from "./scripts/helpers/cookies.js";
import {setUpEventHandlers} from "./scripts/event-handlers.js";
import {setupSocketConnectionWithAPI} from './scripts/caption-ninja.js';
import {setupWebkitSpeechRecognition} from './scripts/voice-recognition.js';
import {initAudioDevices} from "./scripts/audio-devices.js";
import {initializeAWS} from './scripts/aws.js';
import {initLocalWebsockets} from './scripts/local-websocket.js';

(async () => {
    await initAudioDevices();
    setUpEventHandlers();
    setupSocketConnectionWithAPI();
    setupWebkitSpeechRecognition();
    initLocalWebsockets();

    let awsRegion = getCookie("awsRegion");
    let awsCredentials = getCookie("awsCredentials");
    if (awsRegion && awsCredentials){
        initializeAWS(awsRegion, awsCredentials);
    }
})();