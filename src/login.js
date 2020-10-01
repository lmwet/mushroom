import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    //this is a constructor property
    constructor(props) {
        super(props);
        this.state = {};
    }
    submit() {
        axios
            .post("/login", {
                email: this.state.email,
                password: this.state.password,
            })
            .then((res) => {
                if (res.data.success) {
                    location.replace("/");
                    console.log("location replaced");
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
    render() {
        return (
            <div>
                {this.state.error && (
                    <div className="error">Ow no, something went wrong.</div>
                )}
                <input
                    name="email"
                    placeholder="e-mail"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    name="password"
                    placeholder="Password"
                    onChange={(e) => this.handleChange(e)}
                />
                <button id="log-in" onClick={() => this.submit()}>
                    Log in
                </button>
                <Link to="password">Reset password</Link>
            </div>
        );
    }
}
