export const STATUS_ICONS = {
    LOADING: "orange notched circle loading icon",
    AUDIOOUT: "green volume up icon",
    AUDIOIN: "blue microphone icon",
    AUDIOINDISABLE: "red microphone slash icon",
    SEND: "blue cloud upload icon",
    RECIEVE: "green cloud download icon",
    ERROR: "red close icon",
    SETTING: "green cog icon",
    COMPLETE: "green check circle outline icon"
};

export const updateStatusIcon = (text, icon = STATUS_ICONS.LOADING) => {
    document.getElementById("status-icon").classList = icon;
    document.getElementById("status-message").innerHTML = `${text} - ${(new Date().toLocaleTimeString())}`;
}