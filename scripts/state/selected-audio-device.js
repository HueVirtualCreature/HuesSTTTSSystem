import {writeCookies} from "../helpers/cookies.js";
import {updateStatusIcon, STATUS_ICONS} from '../status-icon.js';

let selectedAudioDevice = null;

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
    updateStatusIcon(`Setting audio output device to ${selectedAudioDevice}`, STATUS_ICONS.SETTING);
}