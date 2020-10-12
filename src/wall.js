import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { socket } from "./socket";

export default function Wall(props) {
    const elemRef = useRef();
    const wallMessages = useSelector((state) => state && state.wallMessages);

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [wallMessages]);

    const keyCheck = async (e) => {
        if (e.key == "Enter") {
            e.preventDefault(); // prevents line down

            socket.emit("postedWallMsg", e.target.value);
            e.target.value = "";
        }
    };

    const sendMsg = () => {
        const text = document.getElementById("text");
        socket.emit("postedWallMsg", text.value);
        text.value = "";
    };

    return (
        <React.Fragment>
            <h3>
                {props.firstName} {props.lastName}'s wall
            </h3>
            <div className="msg-container" ref={elemRef}>
                {wallMessages &&
                    wallMessages.map((msg, index) => {
                        return (
                            <div className="message-div" key={index}>
                                <Link to={`/user/${msg.sender_id}`}>
                                    <img className="msg-pic" src={msg.url} />
                                </Link>
                                <Link to={`/user/${msg.id}`}>
                                    {msg.first} {msg.last}
                                </Link>
                                {"  "}
                                <p id="message"> {msg.text}</p>
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
} //closes cpnt
