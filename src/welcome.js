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
                <img
                    id="banner-img"
                    src="https://www.onlygfx.com/wp-content/uploads/2018/01/grunge-paw-print-1-980x1024.png"
                />

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
