import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    //this is a constructor property
    constructor(props) {
        super(props);
        this.state = {
            step: "start",
        };
    }

    submitEmail() {
        var self = this;
        axios
            .post("/password/reset/start", {
                email: self.state.email,
            })
            .then((res) => {
                if (res.data.success) {
                    self.setState({
                        step: "reset",
                    });
                } else {
                    self.setState({
                        error: true,
                    });
                }
            });
    }

    submitCode() {
        var self = this;
        axios
            .post("/password/reset/reset", {
                newPw: this.state.newPw,
                code: this.state.code,
                email: self.state.email,
            })
            .then((res) => {
                if (res.data.success) {
                    this.setState({
                        step: "verify",
                    });
                } else {
                    this.setState({
                        error: true,
                    });
                }
            });
    }

    handleChange({ target }) {
        //u could do this: this[target.name] = target.value;
        this.setState({
            [target.name]: target.value, //all sent to state!
        });
    }

    getCurrentDisplay() {
        const step = this.state.step;
        console.log("getCurrentDisplay running");

        if (step == "start") {
            console.log("made it to start");

            return (
                <div>
                    <h2>Reset password</h2>
                    <p>
                        Enter your registration email, you will receive a code
                        to reset your password
                    </p>
                    <input
                        name="email"
                        placeholder="e-mail"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <button
                        id="send-code-button"
                        onClick={() => this.submitEmail()}
                    >
                        Send me a reset code
                    </button>
                </div>
            );
        } else if (step == "reset") {
            console.log("made it to reset");
            return (
                <div>
                    <h2>Reset password</h2>
                    <p>Enter your secret code</p>
                    <input
                        name="code"
                        placeholder="code"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <p>Enter a new password</p>
                    <input
                        name="newPw"
                        placeholder="password"
                        type="password"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <button
                        id="reset-pw-button"
                        onClick={() => this.submitCode()}
                    >
                        Reset password
                    </button>
                </div>
            );
        } else if (step == "verify") {
            console.log("made it to verif");
            return (
                <div>
                    <h2>Reset password</h2>
                    <p>Password succesfully changed!!</p>
                    <Link to="login">Log in with new password</Link>
                </div>
            );
        }
    }
    render() {
        return <div>{this.getCurrentDisplay()}</div>;
    }
}
