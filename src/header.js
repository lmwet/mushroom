import React from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

export default function Header(props) {
    const handleClick = () => {
        (async () => {
            try {
                const { data } = await axios.post(`/logout`);
            } catch (e) {
                console.log("error in logout", e);
            }
        })();
    };

    return (
        <React.Fragment>
            <div id="header">
                <img
                    id="logo-pic"
                    src="/images/oyster.png"
                    alt="oyster-mushroom"
                />
                <Link className="link" to="/users">
                    Find people
                </Link>
                <Link className="link" to="/friends">
                    My friends
                </Link>
                <Link className="link" to="/chat">
                    The Chatroom
                </Link>
                <a href="/logout" className="link">
                    Log Out
                </a>
                <Link to="/">
                    <img
                        id="icon-pic"
                        src={props.imgUrl || "/images/default.png"}
                        alt={props.firstName + " " + props.lastName}
                    />
                </Link>
            </div>
        </React.Fragment>
    );
}
