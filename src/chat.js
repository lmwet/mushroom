import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { socket } from "./socket";

export default function Chat() {
    const elemRef = useRef();

    const messages = useSelector((state) => state && state.messages);

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [messages]);

    const keyCheck = (e) => {
        // console.log("value", e.target.value);
        // console.log("value", e.key);
        if (e.key == "Enter") {
            e.preventDefault(); // prevent line down
            socket.emit("postedMsg", e.target.value);
            e.target.value = ""; //CLEARING!
        }
    };

    const sendMsg = () => {
        const text = document.getElementById("text");
        socket.emit("postedMsg", text.value);
        text.value = "";
    };

    return (
        <React.Fragment>
            <h3>Welcome to the chatroom</h3>
            <div className="msg-container" ref={elemRef}>
                {messages &&
                    messages.map((msg, index) => {
                        return (
                            <div className="message-div" key={index}>
                                <Link to={`/user/${msg.sender_id}`}>
                                    <img className="msg-pic" src={msg.url} />
                                </Link>
                                <Link to={`/user/${msg.id}`}>
                                    <p className="message">
                                        {msg.first} {msg.last} : {msg.text}
                                    </p>
                                </Link>
                            </div>
                        );
                    })}
            </div>
            <div className="write-container">
                <textarea
                    id="text"
                    placeholder="Write a message here"
                    onKeyDown={keyCheck}
                ></textarea>
                <button id="send" onClick={sendMsg}>
                    Send
                </button>
            </div>
        </React.Fragment>
    );
}
