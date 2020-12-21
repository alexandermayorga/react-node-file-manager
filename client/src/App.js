import React, { lazy, Suspense, useContext } from "react";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { Switch, Route, Redirect } from "react-router-dom";

import { FetchProvider } from './context/FetchContext';

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Shared from "./components/Shared";
import Starred from "./components/Starred";
import Layout from "./components/hoc/AdminLayout";

const Drive = lazy(() => import("./components/Drive"));

const PrivateRoute = ({ component: Comp, ...rest }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      component={() =>
        isAuthenticated() ? (
          <Layout>
            <Comp />
          </Layout>
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
        <PrivateRoute component={Shared} exact path="/drive/shared" />
        <PrivateRoute component={Starred} exact path="/drive/starred" />
        <PrivateRoute component={Drive} exact path="/drive/:folderID" />
        <Route exact path="/drive">
          <Redirect to="/drive/my-drive" />
        </Route>
        {/* <PublicRoute restricted={true} component={Login} path="*" /> */}
      </Switch>
    </Suspense>
  );
};

export default function App() {
    return (
      <AuthProvider>
        <FetchProvider>
          <AppRoutes />
        </FetchProvider>
      </AuthProvider>
    );
}
