import React, { useState, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import Input from './Input';
import { AuthContext } from "../../context/AuthContext";
import { publicFetch } from "./../../api";

import { FormSuccess, FormError } from "../ui/Forms";

export default function Login() {
    const {setAuthState} = useContext(AuthContext)
    const [redirectOnLogin, setRedirectOnLogin] = useState(false);
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [loginSuccess, setLoginSuccess] = useState();
    const [loginError, setLoginError] = useState();
    const [loginLoading, setLoginLoading] = useState(false);


    function handleEmailChange(e) {
      setEmail(e.target.value);
      setLoginError(null);
      setLoginSuccess(null);
    }
    function handlePasswordChange(e) {
      setPassword(e.target.value);
      setLoginError(null);
      setLoginSuccess(null);
    }

    async function handleFormSubmit(e) {
      e.preventDefault();

      try {
        setLoginLoading(true);

        const credentials = {
          email,
          password,
        };

        const { data } = await publicFetch.post("login", credentials);
        setAuthState(data);
        setLoginSuccess(data.message);
        setLoginError(null);

        //redirect
        setTimeout(() => {
          setRedirectOnLogin(true);
        }, 700);
      } catch (error) {
        setLoginLoading(false);
        const { data } = error.response;
        setLoginError(data.message);
        setLoginSuccess(null);
      }
    }

    return (
      <>
        {redirectOnLogin && <Redirect to="/" />}
        <div className="centered centered-form">
          <div className="panel panel-primary">
            <div className="panel-heading">
              <h3 className="panel-title text-center">
                <span style={{ color: "#72ba54" }}>Node</span>Drive
              </h3>
            </div>
            <div className="panel-body">
              <form id="login_form" onSubmit={handleFormSubmit}>
                {loginSuccess && <FormSuccess text={loginSuccess} />}
                {loginError && <FormError text={loginError} />}

                <div className="form-group">
                  <label className="hidden" htmlFor="email">
                    Email address
                  </label>
                  <div className="input-group">
                    <div className="input-group-addon">
                      <span
                        className="glyphicon glyphicon-envelope"
                        aria-hidden="true"
                      ></span>
                    </div>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your mail"
                      onChange={handleEmailChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="hidden" htmlFor="password">
                    Password
                  </label>
                  <div className="input-group">
                    <div className="input-group-addon">
                      <span
                        className="glyphicon glyphicon-asterisk"
                        aria-hidden="true"
                      ></span>
                    </div>
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      onChange={handlePasswordChange}
                    />
                  </div>
                </div>

                {loginLoading ? (
                  <button
                    className="btn btn-default btn-block active"
                    disabled="disabled"
                  >
                    Loading...
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary btn-block">
                    Log in
                  </button>
                )}
                <br />
                <Link to="/forgot-password" className="text-primary">
                  Forgot Password?
                </Link>

                <hr />
                <div className="text-center text-primary">
                  <Link to="/register" className="text-primary">
                    Don't have an account? <strong>Register</strong>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    );
}
