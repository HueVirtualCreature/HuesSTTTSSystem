import {getCookie} from "./helpers/cookies.js";
import { updateStatusIcon, STATUS_ICONS} from './status-icon.js';
import {setSelectedAudioDevice} from "./state/selected-audio-device.js";

export const initAudioDevices = async() => {
        updateStatusIcon("Retrieving audio devices", STATUS_ICONS.RECIEVE);
        const devices = await navigator.mediaDevices.enumerateDevices()
        const options = document.getElementById("audio-devices-dropdown");
        devices.forEach(device => {
            if (device.kind !== "audiooutput") {
                return;
            }
            const newOption = document.createElement("option");
            newOption.setAttribute("value", device.deviceId);
            newOption.innerHTML = device.label;
            options.appendChild(newOption);
        });

        const selectedAudioDeviceFromCookie = getCookie("selectedAudioDevice");
        if (selectedAudioDeviceFromCookie) {
            setSelectedAudioDevice(selectedAudioDeviceFromCookie)
            document.getElementById("audio-devices-dropdown").value = selectedAudioDeviceFromCookie;
        }
};