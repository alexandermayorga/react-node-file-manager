import React from 'react'
import Navbar from './Navbar'

export default function Header() {
    return (
        <header>
            <Navbar/>
            <div
                style={{
                    width:"100%", 
                    padding:"25px 0",
                }}
            ></div>
        </header>
    )
}
