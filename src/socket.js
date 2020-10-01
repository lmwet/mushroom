import * as io from "socket.io-client";

import {
    postMessageToAll,
    receiveMessages,
    deleteAccount,
    postWallMessage,
    receiveWallMessages,
} from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        //Chattroom

        socket.on("receiveMessages", (messages) => {
            store.dispatch(receiveMessages(messages));
        });

        socket.on("addMsg", (newMsg) => {
            console.log(`hey msg from chatroom here: ${newMsg}`);
            store.dispatch(postMessageToAll(newMsg));
        });

        //Friends Walls

        socket.on("addWallMsg", (newMsg) => {
            console.log(`hey msg from WALL here: ${newMsg}`);
            store.dispatch(postWallMessage(newMsg));
        });

        socket.on("receiveWallMessages", (messages) => {
            store.dispatch(receiveWallMessages(messages));
        });

        //Delete Account

        socket.on("deleteAccount", (id) => {
            store.dispatch(deleteAccount(id));
        });
    }
};
