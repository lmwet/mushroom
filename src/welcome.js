import React from "react";
// import ReactDOM, { render } from "react-dom";

//here I tell welcome component to render the Register cpnt
import Register from "./register";
import Login from "./login";
import ResetPassword from "./reset-password";
import { HashRouter, Route } from "react-router-dom";

export default class Welcome extends React.Component {
    render() {
        return (
            <div id="splash">
                <h1>Welcome to MushRoom</h1>
                <img id="banner-img" src="/images/oyster.png" />

                <HashRouter>
                    <div>
                        <Route path="/login" component={Login} />
                        <Route exact path="/" component={Register} />
                        <Route path="/password" component={ResetPassword} />
                    </div>
                </HashRouter>
            </div>
        );
    }
}
