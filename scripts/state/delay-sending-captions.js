let delaySendingCaptions = false;

export const getDelaySendingCaptions = () => delaySendingCaptions;

export const toggleDelaySendingCaptions = () => {
    const button = document.getElementById("send-with-voice-button");
    if (button.classList.value.includes("negative")) {
        button.classList = button.classList.value.replace("negative", "positive");
        delaySendingCaptions = true;
        return;
    }
    if (button.classList.value.includes("positive")) {
        button.classList = button.classList.value.replace("positive", "negative");
        delaySendingCaptions = false;
    }
}