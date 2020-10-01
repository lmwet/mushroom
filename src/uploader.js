import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        console.log("props in uploader", props);
    }
    handleChange({ target }) {
        this.setState({
            [target.name]: target.files[0], //all key values sent to state!
        });
    }

    uploadImage(e) {
        e.preventDefault();
        var formData = new FormData();
        formData.append("file", this.state.file);

        axios
            .post("/upload", formData)
            .then((res) => {
                if (res.data.success) {
                    //passing the new url to the app cpnt
                    this.props.passUrl(res.data.url);
                } else {
                    this.setState({ error: true });
                }
            })
            .catch(function (err) {
                console.log("err in POST /upload: ", err);
            });
    }

    render() {
        return (
            <React.Fragment>
                <div id="modal">
                    <div id="modal-card" style={{ zIndex: "50" }}>
                        <span id="modal-close" onClick={this.props.toggleModal}>
                            &times;
                        </span>
                        <input
                            onChange={(e) => this.handleChange(e)}
                            type="file"
                            name="file"
                            id="chose-image"
                            accept="image/*"
                        />
                        {this.state.error && (
                            <div className="error">
                                Ow no, something went wrong
                            </div>
                        )}
                        <h3>Chose a new profile picture and upload it</h3>
                        <button
                            onClick={(e) => this.uploadImage(e)}
                            id="upload-img-btn"
                        >
                            Load picture
                        </button>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
