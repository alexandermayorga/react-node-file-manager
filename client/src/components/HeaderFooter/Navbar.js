import React from 'react'

export default function Navbar() {
    return (
        <nav className="navbar navbar-inverse navbar-fixed-top">
            <div className="container-fluid">
                <div className="navbar-header">
                    <a className="navbar-brand" href="/">
                        <span className="glyphicon glyphicon-folder-open" style={{ marginRight: "15px" }} aria-hidden="true"></span>File Manager
                    </a>
                </div>
            </div>
        </nav>
    )
}
