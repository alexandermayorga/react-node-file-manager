import React from 'react'
import Navbar from './Navbar'

export default function Header() {
    return (
        <header style={{marginTop : "25px"}}>
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        <Navbar/>
                    </div>
                </div>
            </div>
        </header>
    )
}
