// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.0;

interface IReactiveFlashLoan{

    struct LP {
        address user;
        uint256 balance;
        uint256 allowance;
    }

    struct withdrawLP{
        address user;
        uint256 withdrawAmount;
    }

    struct FlashLoanAddress{
        address flashLoanContract;
        address flashLoanToken;
    }
}