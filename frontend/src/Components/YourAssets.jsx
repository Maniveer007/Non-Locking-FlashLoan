import React from "react";
import temp from "../images/temp.png";
import "./YourAssets.css";

const YourAssets = () => {
  return (
    <div className="YourAssets_container">
      <div className="YourAssets_container_data">
        <div className="YourAssets_container_data_left">
          <img src={temp}></img>
          <div className="YourAssets_container_data_left_right">
            <h2>DAI in Aave</h2>
            <p>2.27% APY</p>
          </div>
        </div>
        <div className="YourAssets_container_data_right">
          <p>4042.2129124</p>
        </div>
      </div>

      <div className="YourAssets_container_data">
        <div className="YourAssets_container_data_left">
          <img src={temp}></img>
          <div className="YourAssets_container_data_left_right">
            <h2>DAI in Aave</h2>
            <p>2.27% APY</p>
          </div>
        </div>
        <div className="YourAssets_container_data_right">
          <p>4042.2129124</p>
        </div>
      </div>
    </div>
  );
};
export default YourAssets;
