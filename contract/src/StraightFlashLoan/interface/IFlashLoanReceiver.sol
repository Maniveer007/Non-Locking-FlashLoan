// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.0;

interface IFlashLoanReceiver {
    function executeOperation (address initiator, uint amount) external returns (bool);
}