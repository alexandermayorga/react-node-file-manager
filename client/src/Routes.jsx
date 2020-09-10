import React from 'react'
import { Switch, Route, Redirect } from "react-router-dom";

import PrivateRoute from "./components/authRoutes/PrivateRoutes";
import PublicRoute from "./components/authRoutes/PublicRoutes";

import Home from './components/Home';
import SignIn from './components/Login';
import Register from './components/Register';
import Drive from './components/Drive';
// import Profile from "./components/admin/Profile";

const Routes = (props) => {
    return (
        <Switch>
            <PrivateRoute {...props} component={Drive} exact path="/drive/:folderID" />
            <Route exact path="/drive"><Redirect to="/drive/my-drive" /></Route>
            <PublicRoute {...props} restricted={true} component={SignIn} exact path="/login" />
            <PublicRoute {...props} restricted={true} component={Register} exact path="/register" />
            <PublicRoute {...props} restricted={false} component={Home} exact path="/" />
            <PublicRoute {...props} restricted={true} component={SignIn} path="*" />
        </Switch>
    )
}

export default Routes
