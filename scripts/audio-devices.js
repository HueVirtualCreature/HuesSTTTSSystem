import {getCookie} from "./helpers/cookies.js";
import { speechStatusUpdate, STATUS_ICONS} from './speech-status.js';
import {setSelectedAudioDevice} from "./state/selected-audio-device.js";

export const initAudioDevices = async() => {
        speechStatusUpdate("Retrieving audio devices", STATUS_ICONS.RECIEVE);
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