import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Register extends React.Component {
    //this is a constructor property
    constructor(props) {
        super(props);
        this.state = {};
    }
    submit() {
        axios
            .post("/register", {
                first: this.state.first,
                last: this.state.last,
                email: this.state.email,
                password: this.state.password
            })
            .then(res => {
                if (res.data.success) {
                    //in the index file u send json success true or success:false in the app.post
                    location.replace("/"); //means u cant go back to registration with previous page button
                } else {
                    this.setState({
                        //this works because I am in an arrow function
                        error: true
                    });
                }
            });
    }
    handleChange({ target }) {
        this.setState({
            [target.name]: target.value //all key values sent to state!
        });
    }
    render() {
        return (
            <div>
                {this.state.error && (
                    <div className="error">Ow no, something went wrong</div>
                )}
                <input
                    name="first"
                    placeholder="First Name"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    name="last"
                    placeholder="Last Name"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    name="email"
                    placeholder="e-mail"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    name="password"
                    placeholder="Password"
                    type="password"
                    onChange={e => this.handleChange(e)}
                />
                <button id="register" onClick={() => this.submit()}>
                    Register
                </button>
                <Link to="login">Log in</Link>
            </div>
        );
    }
}
