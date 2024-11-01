import React from "react";
import usdc from "../images/usdc.png";
import "./LiquidityProviders.css";
import { ethers } from "ethers";

const YourAssets = ({ data }) => {
  return (
    <div className="YourAssets_container">
      {data?.map((k, index) => {
        return (
          <div className="YourAssets_container_data" key={index}>
            <div className="YourAssets_container_data_left">
              <img src={usdc}></img>
              <div className="YourAssets_container_data_left_right">
                <h2>
                  {k[0]
                    ? `${k[0]?.slice(0, 6)}...${k[0]?.slice(
                        k[0].length - 4,
                        k[0].length
                      )}`
                    : " "}
                </h2>
              </div>
            </div>
            <div className="YourAssets_container_data_right">
              <p>
                {Math.min(
                  ethers.utils.formatUnits(k[1], 6),
                  ethers.utils.formatUnits(k[2], 6)
                )}{" "}
                USDC
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default YourAssets;
