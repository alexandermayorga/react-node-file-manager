import React from 'react'
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="navbar navbar-inverse navbar-fixed-top">
            <div className="container-fluid">
                <div className="navbar-header">
                    <Link className="navbar-brand" to="/drive/my-drive">
                        <span className="glyphicon glyphicon-folder-open" style={{ marginRight: "15px" }} aria-hidden="true"></span>Node Drive
                    </Link>
                </div>
            </div>
        </nav>
    )
}
