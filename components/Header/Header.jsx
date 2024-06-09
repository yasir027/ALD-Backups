import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import * as classes from "./Header.module.css";
import Navbar from "./Navbar"; // Import Navbar component
import titleImage from "../../assets/aldtitle.png"; // Import the title image
import  logo from "../../assets/logo.png";

export const HeaderComponent = () => {
  return (
    <div className={classes.headerComponent}>
      {/* Logo or title image */}
      <div className={classes.titlelogo}>
      <img
        className={classes.logoImage}
        src={logo}
        alt="Title Logo"
      />
        
      <img
        className={classes.titleImage}
        src={titleImage}
        alt="Title Logo"
      />
        </div>
      <div className={classes.headerComponentInner}>
        {/* Navbar component for navigation */}
        <Navbar className={classes.navBarDefault} />

        {/* Login button with Link component */}
        <Link to="/login">
          <button className={classes.loginButton}>LOGIN</button>
        </Link>
      </div>
    </div>
  );
};

export default HeaderComponent;
