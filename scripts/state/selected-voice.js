import {writeCookies} from "../helpers/cookies.js";
import {updateStatusIcon, STATUS_ICONS} from '../status-icon.js';

let selectedVoice = 'Matthew';

export const getSelectedVoice = () => {
    return selectedVoice;
};

export const setSelectedVoice = (sv) => {
    selectedVoice = sv;
};

export const voiceOptionsDropdown_onChange = () => {
    selectedVoice = document.getElementById("voice-options-dropdown").value;
    writeCookies("selectedVoice", selectedVoice);
    updateStatusIcon(`Setting speaker voice to ${selectedVoice}`, STATUS_ICONS.SETTING);
}
