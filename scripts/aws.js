import {speechStatusUpdate, STATUS_ICONS} from "./speech-status.js";
import {getCookie, writeCookies} from "./helpers/cookies.js";
import {getSelectedVoice, setSelectedVoice} from "./state/selected-voice.js";
import {dynamicSortMultiple} from './helpers/dynamic-sort.js';
import {playSound} from "./helpers/play-sound.js";

const DEFAULT_SPEAKERID = "Matthew";
const VOICE_LANGUAGES = "en-AU | en-GB | en-GB-WLS | en-IN | en-US | ja-JP";
const BAD_VOICES = [
    "Olivia",
    "Arthur",
    "Kajal",
    "Kevin",
    "Ruth",
    "Steven"
];

let awsConnected = false;

/*https://docs.aws.amazon.com/polly/latest/dg/voice-speed-vip.html*/
export const RequestAudioQuery = (text, speaker = DEFAULT_SPEAKERID) => {
    if (awsConnected === false) return;

    // Create the JSON parameters for getSynthesizeSpeechUrl
    const speechParams = {
        OutputFormat: "mp3",
        SampleRate: "16000",
        Engine: "standard",
        Text: "",
        TextType: "text",
        VoiceId: getSelectedVoice()
    };
    speechParams.Text = text;

    // Create the Polly service object and presigner object
    const polly = new AWS.Polly({apiVersion: '2016-06-10'});
    const signer = new AWS.Polly.Presigner(speechParams, polly)

    // Create presigned URL of synthesized speech file
    signer.getSynthesizeSpeechUrl(speechParams, function(error, url) {
        if (error) {
            speechStatusUpdate(error, STATUS_ICONS.ERROR);
            return;
        }
        speechStatusUpdate("Speech synthesized", STATUS_ICONS.RECIEVE);
        playSound(url);
    });
}

export const connectAws = async () =>  {
    const regionTextBoxValue = document.getElementById("awsRegionTextBox")?.value || null;
    const identityPoolIDTextBoxValue = document.getElementById("awsIdentityPoolTextBox")?.value || null;

    if (!regionTextBoxValue || !identityPoolIDTextBoxValue) return;
    initializeAWS(regionTextBoxValue, identityPoolIDTextBoxValue);
}

export const initializeAWS = (region, identityPoolID) => {
    speechStatusUpdate("Setting AWS Config", STATUS_ICONS.SETTING);

    // Initialize the Amazon Cognito credentials provider
    AWS.config.region = region;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: identityPoolID
    });

    awsConnected = true;
    writeCookies("awsRegion", region);
    writeCookies("awsCredentials", identityPoolID);
    getAvailableSpeakers();
}


const getAvailableSpeakers = () => {
    if (awsConnected === false) return;

    speechStatusUpdate("Retrieving AWS Polly voices", STATUS_ICONS.RECIEVE);
    // Create the Polly service object and presigner object
    const polly = new AWS.Polly({apiVersion: '2016-06-10'});

    polly.describeVoices({}, function(err, data) {
        if (err) {
            speechStatusUpdate(`Failed to retrieve available voices from server`, STATUS_ICONS.ERROR);
            console.log(err, err.stack);
            return;
        }
        speechStatusUpdate(`Retrieved available voices from server`, STATUS_ICONS.RECIEVE);
        const options = document.getElementById("voice-options-dropdown");
        data.Voices
            .filter(voice => (VOICE_LANGUAGES).includes(voice.LanguageCode))
            .filter(voice => !BAD_VOICES.find(bv => voice.Name.toLowerCase() === bv.toLowerCase()))
            .sort(dynamicSortMultiple("LanguageCode", "Name"))
            .forEach(voice => {
                const newOption = document.createElement("option");
                newOption.setAttribute("value", voice.Id);
                newOption.innerHTML = `${voice.Name} (${voice.LanguageCode})`;
                options.appendChild(newOption);
            });
        const selectedVoiceFromCookie = getCookie("selectedVoice");
        if (selectedVoiceFromCookie) {
            document.getElementById("voice-options-dropdown").value = selectedVoiceFromCookie;
            setSelectedVoice(selectedVoiceFromCookie)
        }
    });
}