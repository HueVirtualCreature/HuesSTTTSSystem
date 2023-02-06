import {writeCookies} from "../helpers/cookies.js";
import {speechStatusUpdate, STATUS_ICONS} from '../speech-status.js';

let selectedAudioDevice = 'Matthew';

export const getSelectedAudioDevice = () => {
    return selectedAudioDevice;
};

export const setSelectedAudioDevice = (audioDevice) => {
    selectedAudioDevice = audioDevice;
};

export const audioOutputDeviceDropdown_onChange = () => {
    selectedAudioDevice = document.getElementById("audio-devices-dropdown").value;
    console.debug("Audio out set to: ", selectedAudioDevice);
    writeCookies("selectedAudioDevice", selectedAudioDevice);
    speechStatusUpdate(`Setting audio output device to ${selectedAudioDevice}`, STATUS_ICONS.SETTING);
}