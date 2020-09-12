import React, {useState} from 'react'
import axios from 'axios'
import { Link, useHistory, useLocation } from "react-router-dom";
import Input from './Input';

export default function Register() {
    let history = useHistory();
    let location = useLocation();
    let { from } = location.state || { from: { pathname: "/drive/my-drive" } };
    const [username, setUsername] = useState()
    const [firstname, setFirstName] = useState()
    const [lastname, setLastName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [passwordConfirm, setPasswordConfirm] = useState()

    function formSubmitHandler(e){
        e.preventDefault()
        //Form Validation

        const user = {
            username,
            firstname,
            lastname,
            email,
            password
        }
        
        axios.post('api/register',user)
            .then(res => {
                // console.log("Registration Success!")
                // localStorage.setItem("userLoggedIn", "true")
                history.push("drive/my-drive");
            })
            .catch(err => {
                console.log("Registration Error!")
                console.log(err.response.data)
            })

    }
    
    return (

        <div className="centered centered-form">
            <div className="panel panel-primary">
                <div className="panel-heading">
                    <h3 className="panel-title text-center">Register for Free</h3>
                </div>
                <div className="panel-body">

                    <form id="register_form" onSubmit={formSubmitHandler}>
                
                        <div className="form-group">
                            <label className="hidden" htmlFor="username">Username</label>
                            <div className="input-group">
                                <div className="input-group-addon"><span className="glyphicon glyphicon-user" aria-hidden="true"></span></div>
                                <Input 
                                    type='text'
                                    id='username'
                                    name='username'
                                    placeholder='Pick a username'
                                    onChange={(e) => setUsername(e.target.value)}
                                    />
                            </div>
                        </div>
                
                        <div className="form-group">
                            <label className="hidden" htmlFor="firstname">First Name</label>
                            <div className="input-group">
                                <div className="input-group-addon"><span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></div>
                                <Input
                                    type='text'
                                    id='firstname'
                                    name='firstname'
                                    placeholder='Your Firstname'
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                        </div>
                
                        <div className="form-group">
                            <label className="hidden" htmlFor="lastname">Last Name</label>
                            <div className="input-group">
                                <div className="input-group-addon"><span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></div>
                                <Input
                                    type='text'
                                    id='lastname'
                                    name='lastname'
                                    placeholder='Your Lastname'
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>
                
                        <div className="form-group">
                            <label className="hidden" htmlFor="email">Email address</label>
                            <div className="input-group">
                                <div className="input-group-addon"><span className="glyphicon glyphicon-envelope" aria-hidden="true"></span></div>
                                <Input
                                    type='email'
                                    id='email'
                                    name='email'
                                    placeholder='youremail@email.com'
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

                        <div className="form-group">
                            <label className="hidden" htmlFor="password_confirm">Confirm Password</label>
                            <div className="input-group">
                                <div className="input-group-addon"><span className="glyphicon glyphicon-asterisk" aria-hidden="true"></span></div>
                                <Input
                                    type='password'
                                    id='password_confirm'
                                    name='password_confirm'
                                    placeholder='Re-enter your password'
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block">Register</button>

                        <hr/>

                        <div className="text-center text-primary">
                            <Link to="/login" className="text-primary">
                                Have an account already? <strong>Login</strong>
                            </Link>
                        </div>

                    </form>
                </div>
            </div>
        </div>
        
    )
}
