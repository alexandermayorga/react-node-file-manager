import React, { lazy, Suspense, useContext } from "react";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { Switch, Route, Redirect } from "react-router-dom";

import { FetchProvider } from './context/FetchContext';

import Home from "./components/Home";
import SignIn from "./components/Login";
import Register from "./components/Register";

const Drive = lazy(() => import("./components/Drive"));

const PrivateRoute = ({ component: Comp, ...rest }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      component={() =>
        isAuthenticated() ? (
          <Comp/>
        ) : (
          <Redirect to="/login" />
        )
      }
    />
    
  );
};

const PublicRoute = ({ component: Comp, ...rest }) => {
    const { isAuthenticated } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      component={() =>
        rest.restricted ? (
          !isAuthenticated() ? (
            <Comp />
          ) : (
            <Redirect to="/drive/my-drive" />
          )
        ) : (
          <Comp />
        )
      }
    />
  );
};

const AppRoutes = (props) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <PrivateRoute
          {...props}
          component={Drive}
          exact
          path="/drive/:folderID"
        />
        <Route exact path="/drive">
          <Redirect to="/drive/my-drive" />
        </Route>
        <PublicRoute
          {...props}
          restricted={true}
          component={SignIn}
          exact
          path="/login"
        />
        <PublicRoute
          {...props}
          restricted={true}
          component={Register}
          exact
          path="/register"
        />
        <PublicRoute
          {...props}
          restricted={false}
          component={Home}
          exact
          path="/"
        />
        {/* <PublicRoute {...props} restricted={true} component={SignIn} path="*" /> */}
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
