import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { receiveFriends, endFriendship, acceptFriendship } from "./actions";

export default function Friends() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(receiveFriends());
    }, []);

    const friends = useSelector(
        (state) =>
            state.friends &&
            state.friends.filter((friend) => friend.accepted == true)
    );

    const wannabes = useSelector(
        (state) =>
            state.friends &&
            state.friends.filter((friend) => friend.accepted == false)
    );

    if (!friends) {
        console.log("are we in if no friends?");

        return (
            <p>
                Visit <Link to={`/users`}>Find People</Link> to make friends
            </p>
        );
    } else {
        return (
            <React.Fragment>
                <h1>Friends</h1>

                <div id="accepted">
                    {friends.map((elem) => {
                        return (
                            <div className="friend-card" key={elem.id}>
                                <Link to={`/user/${elem.id}`}>
                                    <img src={elem.url} />
                                </Link>
                                <Link to={`/user/${elem.id}`}>
                                    <p>
                                        {elem.first} {elem.last}
                                    </p>
                                </Link>
                                <button
                                    onClick={() =>
                                        dispatch(endFriendship(elem.id))
                                    }
                                >
                                    End Friendship 🥀
                                </button>
                            </div>
                        );
                    })}
                </div>

                <h1>Wanabee friends</h1>
                <div id="wannabes">
                    {wannabes.map((elem) => {
                        return (
                            <div className="friend-card" key={elem.id}>
                                <Link to={`/user/${elem.id}`}>
                                    <img src={elem.url} />
                                </Link>
                                <Link to={`/user/${elem.id}`}>
                                    <p>
                                        {elem.first} {elem.last}
                                    </p>
                                </Link>
                                <button
                                    onClick={() =>
                                        dispatch(acceptFriendship(elem.id))
                                    }
                                >
                                    Accept Friendship 👯‍♀️
                                </button>
                            </div>
                        );
                    })}
                </div>
            </React.Fragment>
        );
    }
}
