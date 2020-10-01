import axios from "./axios";

//recieve friends, wanabee: req axios to setrver to retrieve friends or wanabees

export async function receiveFriends() {
    const { data } = await axios.get("/friends.json");
    console.log("data in receive friends", data);

    return {
        type: "RECEIVE_FRIENDS",
        friends: data,
    };
}

//accept friends req: post req to server (pass id of user wanabe) should return an object woth type and id of wanab
export async function endFriendship(id) {
    //function declaration of the makeHot action creator, which requests the hot cpnt on users id
    const { data } = await axios.post(`friendship/cancel/${id}.json`);

    return {
        type: "END_FRIENDSHIP",
        id,
    };
}

//unfriend action creator to end friendship
export async function acceptFriendship(id) {
    //function declaration of the makeHot action creator, which requests the hot cpnt on users id
    const { data } = await axios.post(`friendship/accept/${id}.json`);

    return {
        type: "ACCEPT_FRIENDSHIP",
        id,
    };
}

//Chattroom

export async function receiveMessages(messages) {
    return {
        type: "RECEIVE_MESSAGES",
        messages,
    };
}

export async function postMessageToAll(newMsg) {
    return {
        type: "POST_MESSAGE",
        newMsg,
    };
}

//Account

export async function deleteAccount(id) {
    return {
        type: "DELETE_ACCOUNT",
        id,
    };
}

//Wall

export async function receiveWallMessages(wallMessages) {
    return {
        type: "RECEIVE_WALLMESSAGES",
        wallMessages,
    };
}

export async function postWallMessage(newMsg) {
    return {
        type: "POST_WALLMESSAGE",
        newMsg,
    };
}
