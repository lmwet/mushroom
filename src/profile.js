import React, { useEffect, useRef } from "react";
import ProfilePic from "./profilePic";
import BioEditor from "./bioEditor";
import DeleteAccount from "./deleteAccount";
import Wall from "./wall";
import { useDispatch, useSelector } from "react-redux";
import { receiveFriends } from "./actions";

export default function Profile(props) {
    console.log("props in profile", props);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(receiveFriends());
    }, []);

    return (
        <React.Fragment>
            <h2>
                {props.firstName} {props.lastName}
            </h2>
            <ProfilePic
                toggleModal={props.toggleModal}
                imgUrl={props.imgUrl}
                firstName={props.first}
                lastName={props.last}
                id={props.id}
            />

            <BioEditor
                currentBio={props.currentBio}
                setBio={(bioInput) => props.setBio(bioInput)}
            />
            <Wall
                imgUrl={props.imgUrl}
                firstName={props.firstName}
                lastName={props.lastName}
                id={props.id}
            />

            <DeleteAccount id={props.id} />
        </React.Fragment>
    );
}
