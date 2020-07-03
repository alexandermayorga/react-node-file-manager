import React from 'react'

export default function Navbar() {
    return (
        <nav className="navbar navbar-inverse" role="navigation">
            <div className="navbar-header">
                <a className="navbar-brand" href="/"><span className="glyphicon glyphicon-folder-open" style={{ marginRight: "15px"}} aria-hidden="true"></span>File Manager</a>
            </div>
        </nav>
    )
}
