export default function reducer(state = {}, action) {
    if (action.type == "RECEIVE_FRIENDS") {
        return { ...state, friends: action.friends };
    }

    if (action.type == "END_FRIENDSHIP") {
        return {
            ...state,
            friends: state.friends.filter((friend) => {
                return friend.id != action.id;
            }),
        };
    }

    if (action.type == "ACCEPT_FRIENDSHIP") {
        state = {
            ...state,
            friends: state.friends.map((friend) => {
                if (action.id == friend.id) {
                    return {
                        ...friend,
                        accepted: true,
                    };
                } else {
                    return friend;
                }
            }),
        };
    }

    if (action.type == "RECEIVE_MESSAGES") {
        state = { ...state, messages: action.messages.reverse() };
    }

    if (action.type == "POST_MESSAGE") {
        state = {
            ...state,
            messages: state.messages.concat(action.newMsg),
        };
    }

    if (action.type == "DELETE_ACCOUNT") {
        state = {
            ...state,
            friends: state.friends.filter((friend) => {
                return friend.id != action.id;
            }),
            messages: state.messages.filter((msg) => {
                return msg.id != action.id;
            }),
        };
    }

    if (action.type == "RECEIVE_WALLMESSAGES") {
        console.log("action in receive WALL messages", action);
        state = { ...state, wallMessages: action.wallMessages.reverse() };
    }

    if (action.type == "POST_WALLMESSAGE") {
        state = {
            ...state,
            wallMessages: state.wallMessages.concat(action.newMsg),
        };
    }
    console.log("redux state : ", state);
    return state;
} // if reducer is passed a state, it will return it, if its undefined it will create it {}} it will get a series of conditionals
