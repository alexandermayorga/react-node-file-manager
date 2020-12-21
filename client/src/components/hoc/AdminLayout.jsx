import React from 'react'
import Header from "../HeaderFooter/Header";
import Sidebar from '../Sidebar';
import "./dashboard.css";

export default function AdminLayout(props) {
    return (
        <>
            <Header/>
            <div className="adminLayout">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-3 col-md-2 sidebar">
                            <Sidebar/>
                        </div>
                        <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
                            {props.children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
