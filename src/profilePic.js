import React from "react";

export default function ProfilePic(props) {
    // either u write props or the properties names themselves in {}

    return (
        <React.Fragment>
            <img
                id="profile-pic"
                src={props.imgUrl || "/images/default.png"}
                alt={props.firstName + " " + props.lastName}
                onClick={props.toggleModal}
            />
        </React.Fragment>
    );
}
