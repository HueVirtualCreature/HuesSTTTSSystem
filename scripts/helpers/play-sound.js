import {getDelaySendingCaptions} from "../state/delay-sending-captions.js";
import {sendMessageToCaptionNinja} from "../caption-ninja.js";
import {updateStatusIcon, STATUS_ICONS} from "../status-icon.js";
import {getSelectedAudioDevice} from "../state/selected-audio-device.js";

export const playSound = (url) => {
    if (window.audio) { window.audio.pause(); } //TODO maybe implement a queue system instead of ending playback
    if (getDelaySendingCaptions()) {
        sendMessageToCaptionNinja();
    }
    window.audio = new Audio();
    window.audio.src = url;
    window.audio.load();
    window.audio.controls = true;
    window.audio.volume = 1;
    window.audio.onplaying = () => {
        updateStatusIcon("Playing voice", STATUS_ICONS.AUDIOOUT);
    }
    window.audio.onended = () => {
        updateStatusIcon("Voice playback completed", STATUS_ICONS.COMPLETE);
        delete window.audio;
    }

    const selectedAudioDevice = getSelectedAudioDevice();
    if (selectedAudioDevice) {
        window.audio.setSinkId(selectedAudioDevice).then(r => {
            window.audio.play();
        });
        return;
    }

    window.audio.play();
}