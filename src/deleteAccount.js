import React from "react";
import { socket } from "./socket";
import axios from "./axios";

export default function DeleteAccount(props) {
    const handleClick = () => {
        axios
            .post("/delete")
            .then((res) => {
                location.replace("/welcome#");
            })
            .catch((e) => {
                console.log("err in delete acc req", e);
            });

        socket.emit("deleteAccount", props.id);
    };

    return (
        <div>
            <button onClick={handleClick}>Delete my account 🔫</button>
        </div>
    );
}
