const BROADCAST_CHANNEL = 'huestttssytem';

const signaling = new BroadcastChannel(BROADCAST_CHANNEL);
let peerConnection;

export const getSignaling = () => {
    return signaling;
};

const createPeerConnection = () => {
    peerConnection = new RTCPeerConnection();
    peerConnection.onicecandidate = e => {
        const message = {
            type: 'candidate',
            candidate: null,
        };
        if (e.candidate) {
            message.candidate = e.candidate.candidate;
            message.sdpMid = e.candidate.sdpMid;
            message.sdpMLineIndex = e.candidate.sdpMLineIndex;
        }
        signaling.postMessage(message);
    };
}

const handleOffer = async (offer) => {
    if (peerConnection) {
        console.error('existing peerconnection');
        return;
    }
    await createPeerConnection();
    await peerConnection.setRemoteDescription(offer);

    const answer = await peerConnection.createAnswer();
    signaling.postMessage({type: 'answer', sdp: answer.sdp});
    await peerConnection.setLocalDescription(answer);
};

const  handleAnswer = async (answer) => {
    if (!peerConnection) {
        console.error('no peerconnection');
        return;
    }
    await peerConnection.setRemoteDescription(answer);
}

const handleCandidate = async (candidate) => {
    if (!peerConnection) {
        console.error('no peerconnection');
        return;
    }
    if (!candidate.candidate) {
        await peerConnection.addIceCandidate(null);
        return;
    }
    await peerConnection.addIceCandidate(candidate);
}

const  init = async () => {
    await createPeerConnection();

    const offer = await peerConnection.createOffer();
    signaling.postMessage({type: 'offer', sdp: offer.sdp});
    await peerConnection.setLocalDescription(offer);
}

export const initRTC = (additionalHandlers) => {
    signaling.onmessage = e => {
        const {type} = e.data;
        if(type === 'offer'){
            handleOffer(e.data);
            return;
        }
        if(type === 'answer'){
            handleAnswer(e.data);
            return;
        }
        if(type === 'candidate'){
            handleCandidate(e.data);
            return;
        }
        if(type === 'ready'){
            init(e.data);
            return;
        }
        if(additionalHandlers){
            additionalHandlers(e.data);
            return;
        }
        console.log('unhandled', e);
    };
    signaling.postMessage({type: 'ready'});
};