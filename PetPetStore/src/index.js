
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import {Store} from "./components/Store";
import {SignUp, SignIn, ResetPassword} from "./components/LoginPage";
import {HashRouter, Route} from "react-router-dom";
import {ClientCart} from "./components/Client";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
    <HashRouter>
        <div>
            <Route exact path="/" component={SignIn}/>
            <Route path="/signup" component={SignUp}/>
            <Route path="/reset_password" component={ResetPassword}/>
            <Route path="/store" component={Store}/>

            <Route path="/client-cart" component={ClientCart}/>
        </div>
    </HashRouter>,
    document.getElementById("root")
);

serviceWorker.unregister();
