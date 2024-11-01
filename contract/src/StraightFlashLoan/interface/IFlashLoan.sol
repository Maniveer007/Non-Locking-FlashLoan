// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.0;

interface IFlashLoan{

    event UserUpdated (address indexed user,uint indexed balance,uint indexed approve);
    event RequestFlashLoan(address indexed receiver,uint indexed amount);
}