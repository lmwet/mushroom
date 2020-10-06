import React from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

export default function Header(props) {
    // either u write props or the properties names themselves in {}
    console.log("props in header", props);

    const handleClick = () => {
        console.log("handleclick logout");

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
                <img id="logo-pic" src="/images/oyster.png" alt="logo" />
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
                    />{" "}
                </Link>
            </div>
        </React.Fragment>
    );
}
