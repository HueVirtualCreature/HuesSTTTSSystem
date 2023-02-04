import {setFinalTranscript, getFinalTranscript} from "./state/final-transcript.js";
import {speechStatusUpdate, STATUS_ICONS} from "./speech-status.js";
import {updateURL} from "./helpers/url.js";
import {getMyLanguage, setMyLanguage} from "./state/my-language.js";
import {getCounter} from "./state/counter.js";
import {RequestAudioQuery} from "./aws.js";

let socket = new WebSocket("wss://api.caption.ninja:443");
let label = false;

const generateStreamID = () => {
    let text = "";
    const possible = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    for (let i = 0; i < 7; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

const getRoomId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    //Get the RoomID by parsing URL
    if (urlParams.has("room"))  {
        return urlParams.get("room");
    }
    if (urlParams.has("ROOM"))  {
        return urlParams.get("ROOM");
    }
    const roomID = generateStreamID();
    updateURL("room=" + roomID);
    return roomID;
};

export const setupSocketConnectionWithAPI = () => {
    speechStatusUpdate("Setting up connection with the Caption.Ninja server", STATUS_ICONS.SEND);
    const roomID = getRoomId();
    const urlParams = new URLSearchParams(window.location.search);


    if (urlParams.has("label")) {
        label = urlParams.get("label");
    }

    if (urlParams.has("lang")) {
        setMyLanguage(urlParams.get("lang"));
    }
    else {
        updateURL(`lang=${getMyLanguage()}`);
    }

    //Setup Socket to Communicate with Caption Ninja

    if (urlParams.has("pie")) {
        // get an API key from https://www.piesocket.com/ for a free API server of your own (pie no longer is free? sorry)
        const apiKey = urlParams.get("pie") || "0khtlN7R7ISHZzFiyfK49Q9zAm93Wti5xpbW9qjg";
        socket = new WebSocket(`wss://free3.piesocket.com/v3/${roomID}?api_key=${apiKey}`);
    }

    socket.onclose = function () {
        setTimeout(function () { window.location.reload(true); }, 100);
    };

    socket.onopen = function () {
        socket.send(JSON.stringify({ "join": roomID }));
    }
}

export const sendMessageToCaptionNinja = () => {
    const finalTranscript = getFinalTranscript();
    RequestAudioQuery(finalTranscript);
    try {
        speechStatusUpdate("Sending message to the server", STATUS_ICONS.SEND);
        const counter = getCounter();
        if (label) {
            socket.send(JSON.stringify({ "msg": true, "final": finalTranscript, "id": counter, "label": label }));
        }
        if (!label) {
            socket.send(JSON.stringify({ "msg": true, "final": finalTranscript, "id": counter }));
        }
        setFinalTranscript('');
    } catch (ex) {
        console.error("Encountered an error with sending message to the server.", ex);
        speechStatusUpdate("Encountered an error with sending message to the server. Developer's console contains more information.", STATUS_ICONS.ERROR);
    }
}

export const getOverlayLink = () => {
    navigator.clipboard.writeText("https://caption.ninja" + "/overlay?room=" + getRoomId()).then(() => { speechStatusUpdate("Overlay link copied to clipboard", STATUS_ICONS.COMPLETE); }, () => { });
}