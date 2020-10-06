import React from "react";
import axios from "./axios"; //we import it from the file so it comes with the csurf stuff
import Profile from "./profile";
import Uploader from "./uploader";
import Header from "./header";
import { BrowserRouter, Route } from "react-router-dom";
import OtherProfile from "./otherProfile";
import FindPeople from "./findPeople";
import Friends from "./friends";
import Chat from "./chat";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
        };
        this.toggleModal = this.toggleModal.bind(this);
    }

    componentDidMount() {
        //get route to /
        axios
            .get("/first")
            .then((resp) => {
                this.setState({
                    id: resp.data.id,
                    first: resp.data.first,
                    last: resp.data.last,
                    imgUrl: resp.data.url || "/images/default.png",
                    bio: resp.data.bio,
                });
            })
            .catch(function (err) {
                console.log("err in get /", err);
            });
        console.log("this in app after setstaite inaxios", this);
    }

    toggleModal() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    passUrl(newUrl) {
        console.log("passUrl runnin");

        this.setState({
            imgUrl: newUrl,
        });
        this.toggleModal();
        console.log("url in app", this.state.imgUrl);
    }
    setBio(bioInput) {
        this.setState({
            currentBio: bioInput,
        });
    }

    render() {
        return (
            <React.Fragment>
                <BrowserRouter>
                    <div>
                        <Header
                            firstName={this.state.first}
                            lastName={this.state.last}
                            imgUrl={this.state.imgUrl}
                            myId={this.state.id}
                        />

                        <Route
                            exact
                            path="/user/:id"
                            render={(props) => (
                                <OtherProfile
                                    myId={this.state.id}
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                        <Route
                            path="/users"
                            render={(props) => (
                                <FindPeople
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />

                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    firstName={this.state.first}
                                    lastName={this.state.last}
                                    toggleModal={this.toggleModal}
                                    imgUrl={this.state.imgUrl}
                                    id={this.state.id}
                                    currentBio={this.state.currentBio}
                                    setBio={(bioInput) => this.setBio(bioInput)}
                                />
                            )}
                        />
                        <Route
                            path="/friends"
                            render={(props) => (
                                <Friends
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                        <Route
                            path="/chat"
                            render={(props) => (
                                <Chat
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                        {this.state.uploaderIsVisible && (
                            <Uploader
                                toggleModal={this.toggleModal}
                                passUrl={(newUrl) => this.passUrl(newUrl)}
                                style={uploaderStyle}
                            />
                        )}
                    </div>
                </BrowserRouter>
            </React.Fragment>
        );
    }
}

const uploaderStyle = {
    position: "fixed",
    zIndex: "1",
    left: "0",
    top: "0",
    bottom: "0",
    right: "0",
    width: "100%",
    height: "100%",
    overflow: "auto",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
};
