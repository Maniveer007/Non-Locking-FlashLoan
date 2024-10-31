import React from "react";
import temp from "../images/temp.png";
import "./YourLoans.css";

const YourLoans = () => {
  return (
    <div className="YourLoans_container">
      <div className="YourLoans_container_data">
        <div className="YourLoans_container_data_left">
          <img src={temp}></img>
          <div className="YourLoans_container_data_left_right">
            <h2>DAI in Aave</h2>
            <p>2.27% APY</p>
          </div>
        </div>
        <div className="YourLoans_container_data_right">
          <p>4042.2129124</p>
        </div>
      </div>

      <div className="YourLoans_container_data">
        <div className="YourLoans_container_data_left">
          <img src={temp}></img>
          <div className="YourLoans_container_data_left_right">
            <h2>DAI in Aave</h2>
            <p>2.27% APY</p>
          </div>
        </div>
        <div className="YourLoans_container_data_right">
          <p>4042.2129124</p>
        </div>
      </div>
    </div>
  );
};

export default YourLoans;
