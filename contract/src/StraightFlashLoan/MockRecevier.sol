// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.0;

import "./interface/IFlashLoanReceiver.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Receiver is IFlashLoanReceiver{

    IERC20 public token;

    constructor(address _token) {
        token = IERC20(_token);
    }

    function executeOperation (address initiator, uint amount) external returns (bool){
        token.approve(initiator,(amount*1003)/1000);
        return true;
    }
}