import {getOverlayLink} from "./caption-ninja.js";
import {connectAws} from "./aws.js";
import {toggleVoiceRecognition} from "./voice-recognition.js";
import {toggleDelaySendingCaptions} from "./state/delay-sending-captions.js";
import {audioOutputDeviceDropdown_onChange} from "./state/selected-audio-device.js";
import {voiceOptionsDropdown_onChange} from "./state/selected-voice.js";
import {manualEntry} from "./manual-entry.js";

export const setUpEventHandlers = () => {
    $('.message .close')
        .on('click', function() {
            $(this)
                .closest('.message')
                .transition('fade')
            ;
        });

    $('#copy-overlay-link').on('click', getOverlayLink);
    $('#aws-connect-link').on('click', connectAws);
    $('#microphone-button').on('click', toggleVoiceRecognition);
    $('#send-with-voice-button').on('click', toggleDelaySendingCaptions);
    $('#audio-devices-dropdown').on('change', audioOutputDeviceDropdown_onChange);
    $('#voice-options-dropdown').on('change', voiceOptionsDropdown_onChange);
    $('#manual-entry-button').on('click', manualEntry);
};