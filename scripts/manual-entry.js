import {setFinalTranscript, getFinalTranscript} from "./state/final-transcript.js";
import {getDelaySendingCaptions} from "./state/delay-sending-captions.js";
import {sendMessageToCaptionNinja} from './caption-ninja.js';

let last_manual_entry = "";

export const  manualEntry= ()=>{
    setFinalTranscript(document.getElementById("userinput").value);
    document.getElementById("output").innerHTML = getFinalTranscript();
    document.getElementById("userinput").value = "";
    last_manual_entry = getFinalTranscript();

    try {
        if (!!getFinalTranscript() && !getDelaySendingCaptions()){
            sendMessageToCaptionNinja();
        }
    } catch(e){
        setFinalTranscript('');
    }
}


document.getElementById("userinput").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) { manualEntry(); }
    if (event.keyCode === 38) { document.getElementById("userinput").value = last_manual_entry; }
});