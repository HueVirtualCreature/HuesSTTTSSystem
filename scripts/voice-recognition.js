import {getMyLanguage} from "./state/my-language.js";
import {speechStatusUpdate, STATUS_ICONS} from './speech-status.js';
import {getFinalTranscript, setFinalTranscript} from "./state/final-transcript.js";
import {getCounter, incrementCounter} from './state/counter.js';
import {getDelaySendingCaptions} from "./state/delay-sending-captions.js";
import {sendMessageToCaptionNinja} from './caption-ninja.js';
import {RequestAudioQuery} from './aws.js'


let recognition;
let pauseSpeech = false;

const sanitize =  (string) => {
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

    recognition = new webkitSpeechRecognition();
    speechStatusUpdate("Attempting to start webkitSpeechRecognition", STATUS_ICONS.LOADING);
    if (getMyLanguage()) {
        recognition.lang = getMyLanguage();
    }
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function () {
        speechStatusUpdate("WebSpeechRecognition has started", STATUS_ICONS.AUDIOIN);
    };
    recognition.onspeechstart = function () {
        speechStatusUpdate("WebSpeechRecognition is listening", STATUS_ICONS.AUDIOIN);
    };
    recognition.onspeechend = function () {
        speechStatusUpdate("WebSpeechRecognition is processing", STATUS_ICONS.LOADING);
    };
    recognition.onerror = function (event) {
        console.debug("WebSpeechRecognition encountered an error", event);
        speechStatusUpdate("WebSpeechRecognition encountered an error. Developer's console contains more information.", STATUS_ICONS.ERROR);
    };
    recognition.onend = function (event) {
        console.debug("WebSpeechRecognition has stopped", event);
        speechStatusUpdate("WebSpeechRecognition has stopped.", STATUS_ICONS.AUDIOINDISABLE);
        if (!pauseSpeech) setupWebkitSpeechRecognition();
    };
    recognition.onresult = function (event) {
        speechStatusUpdate("WebSpeechRecognition processed a result", STATUS_ICONS.RECIEVE);
        incrementCounter();
        if (!event.results) {
            speechStatusUpdate("WebSpeechRecognition recieved an empty result", STATUS_ICONS.ERROR);
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
        speechStatusUpdate("WebSpeechRecognition processed a transcription", STATUS_ICONS.COMPLETE);
        console.debug("WebSpeechRecognition processed a transcription: ", getFinalTranscript());

        document.getElementById("output").innerHTML = "<span id='final_" + getCounter() + "'>" + getFinalTranscript() + "</span><br />";
        if (!getDelaySendingCaptions()) {
            sendMessageToCaptionNinja();
            return;
        }
        RequestAudioQuery(getFinalTranscript());
    };
    recognition.start();
}

function forceStartSpeechRecognition() { pauseSpeech = false; recognition.start(); }

function forceStopSpeechRecognition() { pauseSpeech = true; recognition.stop(); }


export const toggleVoiceRecognition = (force, forceValue) => {
    const button = document.getElementById("microphone-button");
    if(force) {
        if(forceValue){
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


