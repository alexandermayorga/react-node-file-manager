import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar() {
  const { logout, authState } = useContext(AuthContext);

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  function handleDropDownClick() {
    setIsDropDownOpen((prevState) => !prevState);
  }

  function handleLogOutClick() {
    logout()
  }

  return (
    <nav className="navbar navbar-inverse navbar-fixed-top">
      <div className="container-fluid">
        <div className="navbar-header">
          <Link className="navbar-brand" to="/drive/my-drive">
            <span
              className="glyphicon glyphicon-folder-open"
              style={{ marginRight: "15px" }}
              aria-hidden="true"
            ></span>
            <span style={{ color: "#77b062" }}>Node</span>
            <span style={{ color: "white" }}>Drive</span>
          </Link>
        </div>
        {/* .navbar-header */}
        {/* <!-- Collect the nav links, forms, and other content for toggling --> */}
        <div className="collapse navbar-collapse">
          <ul className="nav navbar-nav navbar-right">
            <li className={`dropdown ${isDropDownOpen && "open"}`}>
              <span
                className="custom-dropdown"
                data-toggle="dropdown"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
                onClick={handleDropDownClick}
              >
                {authState.userInfo.firstname} <span className="caret"></span>
              </span>
              <ul className="dropdown-menu">
                <li>
                  <a href="/">Action</a>
                </li>
                <li>
                  <a href="/">Another action</a>
                </li>
                <li>
                  <a href="/">Something else here</a>
                </li>
                <li role="separator" className="divider"></li>
                <li>
                  <div
                    className="custom-dropdown__action"
                    onClick={handleLogOutClick}
                  >
                    Log Out
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        {/* .collapse.navbar-collapse */}
      </div>
    </nav>
  );
}
