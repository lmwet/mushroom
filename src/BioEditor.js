import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        var self = this;
        axios
            .get("/bio")
            .then((res) => {
                if (res.data[1].success) {
                    self.setState({
                        currentBio: res.data[0],
                    });
                    self.checkBioState();
                }
            })
            .catch(function (err) {
                console.log("err in get /bio", err);
            });
    }

    checkBioState() {
        if (this.state.currentBio) {
            this.setState({
                bioState: "bioSaved",
            });
        } else if (this.state.currentBio == undefined || null || "") {
            this.setState({
                bioState: "addBio",
            });
        }
    }

    submitBio() {
        var self = this;

        axios
            .post("/bio", {
                currentBio: this.state.bio,
            })
            .then((res) => {
                console.log("res in post bio", res);

                if (res.data[1].success) {
                    self.props.setBio(res.data[0]);

                    self.setState({
                        bioState: "bioSaved",
                        currentBio: res.data[0],
                    });
                } else {
                    self.setState({
                        error: true,
                    });
                }
            });
    }

    handleChange({ target }) {
        this.setState({
            [target.name]: target.value,
        });
    }

    displayBio() {
        const bioState = this.state.bioState;

        if (bioState == "addBio") {
            return (
                <span onClick={() => this.setState({ bioState: "editBio" })}>
                    Add bio
                </span>
            );
        } else if (bioState == "bioSaved") {
            return (
                <div>
                    {this.state.error && (
                        <div className="error">
                            Ow no, something went wrong.
                        </div>
                    )}

                    <p>{this.state.currentBio}</p>
                    <span
                        onClick={() => this.setState({ bioState: "editBio" })}
                    >
                        Edit
                    </span>
                </div>
            );
        } else if (bioState == "editBio") {
            return (
                <div>
                    <input
                        id="bio-editor"
                        name="bio"
                        type="textarea"
                        placeholder="your bio"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <button id="save-bio" onClick={() => this.submitBio()}>
                        Save
                    </button>
                </div>
            );
        }
    }

    render() {
        return <div>{this.displayBio()}</div>;
    }
}
