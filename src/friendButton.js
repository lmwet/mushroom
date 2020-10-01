import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton(props) {
    console.log("props in FB", props);

    let [buttonText, setButtonText] = useState("");
    const otherId = props.otherId;

    useEffect(() => {
        (async () => {
            const { data } = await axios.get(
                `/friendship/status/${otherId}.json`
            );

            if (data.length == 0) {
                console.log("no friendship pending", data);
                setButtonText("Lets make friends 🧚🏽‍♀️🧞‍♀️");
            } else if (data[0].accepted == false) {
                console.log("made it in accepted false");

                if (data[0].receiver_id == props.myId) {
                    setButtonText("Cancel Friendship Request 🍄");
                } else {
                    setButtonText("Accept Friend 👯‍♀️");
                }
            } else if (data[0].accepted == true) {
                console.log("accepted true", data);
                setButtonText("End friendship 🥀");
            }
        })();
    }, []);

    const handleClick = () => {
        //axios req depending on what button was before
        if (buttonText == "Lets make friends 🧚🏽‍♀️🧞‍♀️") {
            (async () => {
                try {
                    const { data } = await axios.post(
                        `/friendship/request/${otherId}.json`
                    );
                    console.log("data in request fr", data);

                    if (data[0].sender_id == props.myId) {
                        setButtonText("Cancel Friendship Request 🍄");
                    } else {
                        setButtonText("Accept Friend 👯‍♀️");
                    }
                } catch (e) {
                    console.log("error in post friendship", e);
                }
            })();
        } else if (
            buttonText == "Cancel Friendship Request 🍄" ||
            buttonText == "End friendship 🥀"
        ) {
            (async () => {
                try {
                    const { data } = await axios.post(
                        `/friendship/cancel/${otherId}.json`
                    );
                    setButtonText("Lets make friends 🧚🏽‍♀️🧞‍♀️");
                } catch (e) {
                    console.log("error in cancel friendship", e);
                }
            })();
        } else if (buttonText == "Accept Friend 👯‍♀️") {
            (async () => {
                try {
                    const { data } = await axios.post(
                        `/friendship/accept/${otherId}.json`
                    );
                    console.log("data in accept friend", data);
                    setButtonText("End friendship 🥀");
                } catch (e) {
                    console.log("error in cancel friendship", e);
                }
            })();
        }
    };

    return <button onClick={handleClick}>{buttonText}</button>;
}
