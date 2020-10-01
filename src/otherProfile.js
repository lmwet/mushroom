import React from "react";
import axios from "./axios";
import FriendButton from "./friendButton";
import Wall from "./wall";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wallIsVisible: false,
        };
    }

    componentDidMount() {
        const id = this.props.match.params.id;

        axios
            .get(`/user/${id}.json`)
            .then((res) => {
                if (res.data.redirect) {
                    this.props.history.push("/");
                } else {
                    console.log("data from find match", res);

                    let isFriend = res.data[1].rows.filter(
                        (friend) => friend.id == this.props.match.params.id
                    );
                    console.log("isFriend", isFriend);

                    if (isFriend.length == 1) {
                        this.setState({ wallIsVisible: true });
                    }
                }

                this.setState({
                    id: res.data[0].id,
                    first: res.data[0].first,
                    last: res.data[0].last,
                    imgUrl: res.data[0].url,
                    bio: res.data[0].bio,
                });
            })
            .catch(function (err) {
                console.log("err in get /user in other profile", err);
            });
    }

    render() {
        console.log("props in OP", this.props);
        return (
            <div>
                <h1>
                    {this.state.first} {this.state.last} {this.state.id}
                </h1>
                <img
                    id="other-profile-pic"
                    src={this.state.imgUrl || "/images/default.png"}
                    alt={this.state.first + " " + this.state.last}
                />
                <p>{this.state.bio}</p>
                <FriendButton
                    myId={this.props.myId}
                    otherId={this.props.match.params.id}
                />
                {this.state.wallIsVisible && (
                    <Wall
                        imgUrl={this.state.imgUrl}
                        firstName={this.state.first}
                        lastName={this.state.last}
                        myId={this.props.myId}
                        otherId={this.props.match.params.id}
                    />
                )}
            </div>
        );
    }
}
