import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "./navbar.css";
import { useEffect } from "react";
import { ethers } from "ethers";

// import {
//   ConnectKitProvider,
//   ConnectKitButton,
//   getDefaultConfig,
// } from "connectkit";
// import logo from "../images/logo.png";

const Navbar = () => {
  return (
    <div className="gpt3__navbar">
      <div className="gpt3__navbar-links">
        <div className="gpt3__navbar-links_logo">
          <Link to="/">
            {/* <img src={logo}></img> */}
            AAVE
          </Link>
        </div>
      </div>

      <div className="gpt3__navbar-sign">
        <button
          type="button"
          className="navbar_my_nft_button_add"
          // onClick={loadAddress}
        >
          {/* {account
            ? `${account?.slice(0, 6)}...${account?.slice(
                account.length - 4,
                account.length
              )}`
            : "Connect wallet"} */}
          connect wallet
        </button>
      </div>
    </div>
  );
};

export default Navbar;
