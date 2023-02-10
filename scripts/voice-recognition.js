import {getMyLanguage} from "./state/my-language.js";
import {updateStatusIcon, STATUS_ICONS} from './status-icon.js';
import {getFinalTranscript, setFinalTranscript} from "./state/final-transcript.js";
import {getCounter, incrementCounter} from './state/counter.js';
import {getDelaySendingCaptions} from "./state/delay-sending-captions.js";
import {sendMessageToCaptionNinja} from './caption-ninja.js';
import {RequestAudioQuery} from './aws.js'
import {getCookie, writeCookies} from "./helpers/cookies.js";

const VOICE_RECOGNITION_ON_COOKIE = 'voiceRecognitionOn';

let recognition;
let pauseSpeech = false;

const sanitize = (string) => {
    let temp = document.createElement('div');
    temp.innerText = string;
    temp.innerText = temp.innerHTML;
    temp = temp.textContent || temp.innerText || "";
    temp = temp.substring(0, Math.min(temp.length, 500));
    return temp.trim();
};

export const setupWebkitSpeechRecognition = () => {
    if (!'webkitSpeechRecognition' in window) {
        return;
    }

    const shouldStartVoiceRecognition = getCookie(VOICE_RECOGNITION_ON_COOKIE) !== 'false';
    pauseSpeech = !shouldStartVoiceRecognition;

    recognition = new webkitSpeechRecognition();
    updateStatusIcon("Attempting to start webkitSpeechRecognition", STATUS_ICONS.LOADING);
    if (getMyLanguage()) {
        recognition.lang = getMyLanguage();
    }
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function () {
        updateStatusIcon("WebSpeechRecognition has started", STATUS_ICONS.AUDIOIN);
    };
    recognition.onspeechstart = function () {
        updateStatusIcon("WebSpeechRecognition is listening", STATUS_ICONS.AUDIOIN);
    };
    recognition.onspeechend = function () {
        updateStatusIcon("WebSpeechRecognition is processing", STATUS_ICONS.LOADING);
    };
    recognition.onerror = function (event) {
        console.debug("WebSpeechRecognition encountered an error", event);
        updateStatusIcon("WebSpeechRecognition encountered an error. Developer's console contains more information.", STATUS_ICONS.ERROR);
    };
    recognition.onend = function (event) {
        console.debug("WebSpeechRecognition has stopped", event);
        updateStatusIcon("WebSpeechRecognition has stopped.", STATUS_ICONS.AUDIOINDISABLE);
        if (!pauseSpeech) setupWebkitSpeechRecognition();
    };
    recognition.onresult = function (event) {
        updateStatusIcon("WebSpeechRecognition processed a result", STATUS_ICONS.RECIEVE);
        incrementCounter();
        if (!event.results) {
            updateStatusIcon("WebSpeechRecognition recieved an empty result", STATUS_ICONS.ERROR);
            return;
        }

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                setFinalTranscript(getFinalTranscript() + sanitize(event.results[i][0].transcript));
            }
        }

        if (!getFinalTranscript()) {
            return;
        }
        updateStatusIcon("WebSpeechRecognition processed a transcription", STATUS_ICONS.COMPLETE);
        console.debug("WebSpeechRecognition processed a transcription: ", getFinalTranscript());

        document.getElementById("output").innerHTML = "<span id='final_" + getCounter() + "'>" + getFinalTranscript() + "</span><br />";
        if (!getDelaySendingCaptions()) {
            sendMessageToCaptionNinja();
            return;
        }
        RequestAudioQuery(getFinalTranscript());
    };
    recognition.start();
    if (pauseSpeech) {
        const button = document.getElementById("microphone-button");
        button.classList = button.classList.value.replace("negative", "positive");
        recognition.stop();
    }
}

function forceStartSpeechRecognition() {
    pauseSpeech = false;
    recognition.start();
    writeCookies(VOICE_RECOGNITION_ON_COOKIE, !pauseSpeech);
}

function forceStopSpeechRecognition() {
    pauseSpeech = true;
    recognition.stop();
    writeCookies(VOICE_RECOGNITION_ON_COOKIE, !pauseSpeech);
}


export const toggleVoiceRecognition = (event, force, forceValue) => {
    const button = document.getElementById("microphone-button");
    if (force) {
        if (forceValue) {
            button.classList = button.classList.value.replace("positive", "negative");
            forceStartSpeechRecognition();
            return;
        }
        button.classList = button.classList.value.replace("negative", "positive");
        forceStopSpeechRecognition();
        return;
    }

    //Determine state of button
    if (button.classList.value.includes("negative")) {
        button.classList = button.classList.value.replace("negative", "positive");
        forceStopSpeechRecognition();
        return;
    }
    if (button.classList.value.includes("positive")) {
        button.classList = button.classList.value.replace("positive", "negative");
        forceStartSpeechRecognition();
    }
}


