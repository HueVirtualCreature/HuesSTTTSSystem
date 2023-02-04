import {writeCookies} from "../helpers/cookies.js";
import {speechStatusUpdate, STATUS_ICONS} from '../speech-status.js';

let selectedVoice = 'Matthew';

export const getSelectedVoice = () => {
    return selectedVoice;
};

export const setSelectedVoice = (sv) => {
    selectedVoice = sv;
};

export const voiceOptionsDropdown_onChange = (e) => {
    selectedVoice = document.getElementById("voice-options-dropdown").value;
    writeCookies("selectedVoice", selectedVoice);
    speechStatusUpdate(`Setting speaker voice to ${selectedVoice}`, STATUS_ICONS.SETTING);
}
