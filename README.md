
# Hue's STTTS System
 
 A solution live speech recognition and voice synthesis

## Usage
Access the utility here (Use Google Chrome): [https://huevirtualcreature.github.io/HuesSTTTSSystem/MicrophonePolly](https://huevirtualcreature.github.io/CaptionNinjaSpeaketh/microphone "https://huevirtualcreature.github.io/HuesSTTTSSystem/MicrophonePolly")

### Instructions

##### AWS
You must first set up an AWS account, create a new Identity Pool, Create a new Auth and Unauthenticated Role, make sure you "Enable access to unauthenticated identities", and give the role the permission called "AmazonPollyFullAccess".
Two pieces of information are needed for this tool to work: AWS Region key and the AWS Credentials token. You can find this by looking at the Identity Pool ARN.

##### Insert Credentials
When you open the tool, insert your credentials in the upper right text fields and click "Connect".

The keys will be saved to your cookies for this page and will be used every time you visit or reload the page.

##### Final Setup
Lastly, you need to allow microphone permissions when the page loads. Immediately, the Speech Recognition functionality will start. You may need to reload the page once in order to successfully load the Output Audio Devices (you can check by expanding the dropdown).

Feel free to play with the buttons. You can't really break anything here.

