import React, {useState} from 'react'
import axios from 'axios'
import { Link, useHistory, useLocation } from "react-router-dom";
import Input from './Input';

export default function Login({auth}) {
    let history = useHistory();
    let location = useLocation();
    let { from } = location.state || { from: { pathname: "/drive/my-drive" } };
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    function formSubmitHandler(e) {
        e.preventDefault()

        const user = {
            email,
            password
        }

        axios.post('api/login', user)
            .then(res => {
                // console.log("Login Success!")
                history.replace(from);
            })
            .catch(error => {
                // console.log("Login Error!")
                // console.log(error.response.data)
                console.log(error)
            })

    }

    return (
        <div className="centered centered-form">
            <div className="panel panel-primary">
                <div className="panel-heading">
                    <h3 className="panel-title text-center">Log In</h3>
                </div>
                <div className="panel-body">

                    <form id="login_form" onSubmit={formSubmitHandler}>

                        <div className="form-group">
                            <label className="hidden" htmlFor="email">Email address</label>
                            <div className="input-group">
                                <div className="input-group-addon"><span className="glyphicon glyphicon-envelope" aria-hidden="true"></span></div>
                                <Input
                                    type='email'
                                    id='email'
                                    name='email'
                                    placeholder='Enter your mail'
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="hidden" htmlFor="password">Password</label>
                            <div className="input-group">
                                <div className="input-group-addon"><span className="glyphicon glyphicon-asterisk" aria-hidden="true"></span></div>
                                <Input
                                    type='password'
                                    id='password'
                                    name='password'
                                    placeholder='Enter your password'
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                
                        <button type="submit" className="btn btn-primary btn-block">Log in</button>
                        <br/>
                        <Link to="/forgot-password" className="text-primary">
                            Forgot Password?
                        </Link>
                        
                        <hr/>
                        <div className="text-center text-primary">
                            <Link to="/register" className="text-primary">
                                Don't have an account? <strong>Register</strong>
                            </Link>
                        </div>
                    </form>


                </div>
            </div>
        </div>
    )
}
