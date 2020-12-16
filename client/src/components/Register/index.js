import React, { useState, useContext, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import Input from './Input';
import { FormSuccess, FormError } from "../ui/Forms";
import { AuthContext } from "../../context/AuthContext";
import { publicFetch } from "./../../api";


export default function Register() {
    const [username, setUsername] = useState()
    const [firstname, setFirstName] = useState()
    const [lastname, setLastName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [passwordConfirm, setPasswordConfirm] = useState()

    const { setAuthState } = useContext(AuthContext);
    const [registerSuccess, setRegisterSuccess] = useState();
    const [registerError, setRegisterError] = useState();
    const [registerLoading, setRegisterLoading] = useState(false);
    const [redirectOnRegister, setRedirectOnRegister] = useState(false);

    function handleUsernameChange(e) {
      setUsername(e.target.value);
      setRegisterError(null);
      setRegisterSuccess(null);
    }
    function handleFirstNameChange(e) {
      setFirstName(e.target.value);
      setRegisterError(null);
      setRegisterSuccess(null);
    }
    function handleLastNameChange(e) {
      setLastName(e.target.value);
      setRegisterError(null);
      setRegisterSuccess(null);
    }
    function handleEmailChange(e) {
      setEmail(e.target.value);
      setRegisterError(null);
      setRegisterSuccess(null);
    }
    function handlePasswordChange(e) {
      setPassword(e.target.value);
      setRegisterError(null);
      setRegisterSuccess(null);
    }
    function handleConfirmPasswordChange(e) {
      setPasswordConfirm(e.target.value);
      setRegisterError(null);
      setRegisterSuccess(null);
    }


    async function formSubmitHandler(e){
      e.preventDefault();

      //Form Validation

      try {
        setRegisterLoading(true);
        const newUserInfo = {
          username,
          firstname,
          lastname,
          email,
          password,
        };

        const { data } = await publicFetch.post("register", newUserInfo);

        setAuthState(data);
        setRegisterSuccess(data.message);
        setRegisterError("");

        //redirect
        setTimeout(() => {
          setRedirectOnRegister(true);
        }, 700);
      } catch (error) {
        setRegisterLoading(false);
        const { data } = error.response;
        setRegisterError(data.message);
        setRegisterSuccess("");
      }

    }

    useEffect(() => {
        if (password !== passwordConfirm) {
          setRegisterError("Passwords don't match");
        }
    }, [passwordConfirm]);

    
    return (
      <>
        {redirectOnRegister && <Redirect to="/drive/my-drive" />}
        <div className="centered centered-form">
          <div className="panel panel-primary">
            <div className="panel-heading">
              <h3 className="panel-title text-center">Register for Free</h3>
            </div>
            <div className="panel-body">
              <form id="register_form" onSubmit={formSubmitHandler}>
                {registerSuccess && <FormSuccess text={registerSuccess} />}
                {registerError && <FormError text={registerError} />}
                <div className="form-group">
                  <label className="hidden" htmlFor="username">
                    Username
                  </label>
                  <div className="input-group">
                    <div className="input-group-addon">
                      <span
                        className="glyphicon glyphicon-user"
                        aria-hidden="true"
                      ></span>
                    </div>
                    <Input
                      type="text"
                      id="username"
                      name="username"
                      placeholder="Pick a username"
                      onChange={handleUsernameChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="hidden" htmlFor="firstname">
                    First Name
                  </label>
                  <div className="input-group">
                    <div className="input-group-addon">
                      <span
                        className="glyphicon glyphicon-chevron-right"
                        aria-hidden="true"
                      ></span>
                    </div>
                    <Input
                      type="text"
                      id="firstname"
                      name="firstname"
                      placeholder="Your Firstname"
                      onChange={handleFirstNameChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="hidden" htmlFor="lastname">
                    Last Name
                  </label>
                  <div className="input-group">
                    <div className="input-group-addon">
                      <span
                        className="glyphicon glyphicon-chevron-right"
                        aria-hidden="true"
                      ></span>
                    </div>
                    <Input
                      type="text"
                      id="lastname"
                      name="lastname"
                      placeholder="Your Lastname"
                      onChange={handleLastNameChange}
                    />
                  </div>
                </div>
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
                      placeholder="youremail@email.com"
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
                <div className="form-group">
                  <label className="hidden" htmlFor="password_confirm">
                    Confirm Password
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
                      id="password_confirm"
                      name="password_confirm"
                      placeholder="Re-enter your password"
                      onChange={handleConfirmPasswordChange}
                    />
                  </div>
                </div>

                {registerLoading ? (
                  <button
                    className="btn btn-default btn-block active"
                    disabled="disabled"
                  >
                    Loading...
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary btn-block">
                    Register
                  </button>
                )}
                <hr />
                <div className="text-center text-primary">
                  <Link to="/login" className="text-primary">
                    Have an account already? <strong>Login</strong>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    );
}
